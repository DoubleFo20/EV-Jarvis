package com.evjarvis.android;

import android.content.Context;
import android.opengl.GLES20;
import android.opengl.GLSurfaceView;
import android.opengl.Matrix;
import android.view.MotionEvent;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

/** Original GLES2 visual approximation based on Owner-provided S05 reference photos. */
final class VehicleVisualConceptView extends GLSurfaceView {
    private final ConceptRenderer renderer;
    private float previousX;
    private float previousY;

    VehicleVisualConceptView(Context context) {
        super(context);
        setEGLContextClientVersion(2);
        renderer = new ConceptRenderer();
        setRenderer(renderer);
        setRenderMode(RENDERMODE_WHEN_DIRTY);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (event.getAction() == MotionEvent.ACTION_DOWN) {
            previousX = event.getX();
            previousY = event.getY();
            return true;
        }
        if (event.getAction() == MotionEvent.ACTION_MOVE) {
            float dx = event.getX() - previousX;
            float dy = event.getY() - previousY;
            previousX = event.getX();
            previousY = event.getY();
            renderer.rotate(dx, dy);
            requestRender();
            return true;
        }
        return event.getAction() == MotionEvent.ACTION_UP;
    }

    private static final class ConceptRenderer implements Renderer {
        private static final String VERTEX_SHADER =
                "attribute vec4 aPosition; uniform mat4 uMvp; void main(){gl_Position=uMvp*aPosition;}";
        private static final String FRAGMENT_SHADER =
                "precision mediump float; uniform vec4 uColor; void main(){gl_FragColor=uColor;}";
        private final float[] projection = new float[16];
        private final float[] view = new float[16];
        private final float[] model = new float[16];
        private final float[] mvp = new float[16];
        private int program;
        private int positionHandle;
        private int matrixHandle;
        private int colorHandle;
        private float yaw = 0;
        private float pitch = 5;

        synchronized void rotate(float dx, float dy) {
            yaw += dx * 0.7f;
            pitch = Math.max(-8, Math.min(48, pitch + dy * 0.45f));
        }

        @Override
        public void onSurfaceCreated(GL10 gl, EGLConfig config) {
            GLES20.glClearColor(0.93f, 0.96f, 0.98f, 1f);
            GLES20.glEnable(GLES20.GL_DEPTH_TEST);
            program = linkProgram(VERTEX_SHADER, FRAGMENT_SHADER);
            positionHandle = GLES20.glGetAttribLocation(program, "aPosition");
            matrixHandle = GLES20.glGetUniformLocation(program, "uMvp");
            colorHandle = GLES20.glGetUniformLocation(program, "uColor");
        }

        @Override
        public void onSurfaceChanged(GL10 gl, int width, int height) {
            GLES20.glViewport(0, 0, width, height);
            float aspect = (float) width / Math.max(1, height);
            Matrix.perspectiveM(projection, 0, 42f, aspect, 3f, 20f);
        }

        @Override
        public void onDrawFrame(GL10 gl) {
            GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT | GLES20.GL_DEPTH_BUFFER_BIT);
            GLES20.glUseProgram(program);
            Matrix.setLookAtM(view, 0, 4.4f, 2.5f, 11.2f, 0, 0.72f, 0, 0, 1, 0);
            synchronized (this) {
                Matrix.setIdentityM(model, 0);
                Matrix.rotateM(model, 0, yaw, 0, 1, 0);
                Matrix.rotateM(model, 0, pitch, 1, 0, 0);
            }
            drawBody();
            drawCabin();
            drawDetails();
        }

        private void drawBody() {
            // Each ring follows the rounded bumper, shoulder and hood profile from rear to nose.
            float[][] rings = {
                    {-2.14f, .30f, .40f, .72f, .79f, .56f, .66f, .61f},
                    {-1.94f, .21f, .34f, .79f, .91f, .68f, .78f, .70f},
                    {-1.57f, .18f, .33f, .84f, .97f, .73f, .85f, .74f},
                    {-.85f, .18f, .32f, .83f, .96f, .75f, .86f, .76f},
                    {.70f, .18f, .32f, .82f, .94f, .75f, .86f, .75f},
                    {1.35f, .18f, .32f, .79f, .88f, .73f, .83f, .72f},
                    {1.89f, .23f, .35f, .71f, .78f, .67f, .76f, .65f},
                    {2.15f, .30f, .40f, .62f, .68f, .55f, .65f, .55f}
            };
            for (int i = 0; i < rings.length - 1; i++) {
                for (int face = 0; face < 12; face++) {
                    float[] a = bodyCorner(rings[i], face);
                    float[] b = bodyCorner(rings[i + 1], face);
                    float[] c = bodyCorner(rings[i + 1], (face + 1) % 12);
                    float[] d = bodyCorner(rings[i], (face + 1) % 12);
                    if (face == 3 || face == 7) {
                        drawQuad(a, b, c, d, .77f, .79f, .81f);
                    } else if (face == 4 || face == 5 || face == 6) {
                        drawQuad(a, b, c, d, .87f, .89f, .91f);
                    } else if (face == 0 || face == 10 || face == 11) {
                        drawQuad(a, b, c, d, .52f, .55f, .58f);
                    } else {
                        drawQuad(a, b, c, d, .82f, .84f, .86f);
                    }
                }
            }
            for (int end : new int[]{0, rings.length - 1}) {
                float[] ring = rings[end];
                float shade = end == 0 ? .70f : .79f;
                drawQuad(bodyCorner(ring, 0), bodyCorner(ring, 1),
                        bodyCorner(ring, 10), bodyCorner(ring, 11),
                        shade, shade + .02f, shade + .04f);
                drawQuad(bodyCorner(ring, 1), bodyCorner(ring, 2),
                        bodyCorner(ring, 9), bodyCorner(ring, 10),
                        shade, shade + .02f, shade + .04f);
                drawQuad(bodyCorner(ring, 2), bodyCorner(ring, 3),
                        bodyCorner(ring, 8), bodyCorner(ring, 9),
                        shade, shade + .02f, shade + .04f);
                drawQuad(bodyCorner(ring, 3), bodyCorner(ring, 4),
                        bodyCorner(ring, 7), bodyCorner(ring, 8),
                        shade, shade + .02f, shade + .04f);
                drawQuad(bodyCorner(ring, 4), bodyCorner(ring, 5),
                        bodyCorner(ring, 6), bodyCorner(ring, 7),
                        shade, shade + .02f, shade + .04f);
            }
        }

        private float[] bodyCorner(float[] ring, int face) {
            float x = ring[0];
            float middle = (ring[2] + ring[3]) * .5f;
            float upper = (ring[3] + ring[4]) * .5f;
            float upperWidth = (ring[6] + ring[7]) * .5f;
            switch (face) {
                case 0: return point(x, ring[1], -ring[5]);
                case 1: return point(x, ring[2], -ring[6] * .93f);
                case 2: return point(x, middle, -ring[6]);
                case 3: return point(x, ring[3], -ring[6]);
                case 4: return point(x, upper, -upperWidth);
                case 5: return point(x, ring[4], -ring[7]);
                case 6: return point(x, ring[4], ring[7]);
                case 7: return point(x, upper, upperWidth);
                case 8: return point(x, ring[3], ring[6]);
                case 9: return point(x, middle, ring[6]);
                case 10: return point(x, ring[2], ring[6] * .93f);
                default: return point(x, ring[1], ring[5]);
            }
        }

        private void drawCabin() {
            // The S05's swept glasshouse is a tapered canopy, not a rectangular roof box.
            float[] rearLeft = point(-1.48f, .96f, -.72f);
            float[] rearRight = point(-1.48f, .96f, .72f);
            float[] backRoofLeft = point(-1.02f, 1.39f, -.54f);
            float[] backRoofRight = point(-1.02f, 1.39f, .54f);
            float[] frontRoofLeft = point(.24f, 1.41f, -.53f);
            float[] frontRoofRight = point(.24f, 1.41f, .53f);
            float[] frontLeft = point(1.10f, .91f, -.72f);
            float[] frontRight = point(1.10f, .91f, .72f);
            drawQuad(rearLeft, rearRight, backRoofRight, backRoofLeft, .14f, .19f, .24f);
            drawQuad(frontRoofLeft, frontRoofRight, frontRight, frontLeft, .16f, .22f, .28f);
            drawQuad(backRoofLeft, backRoofRight, frontRoofRight, frontRoofLeft,
                    .83f, .85f, .87f);
            drawQuad(point(-.79f, 1.405f, -.43f), point(-.79f, 1.405f, .43f),
                    point(.07f, 1.425f, .43f), point(.07f, 1.425f, -.43f),
                    .08f, .11f, .15f);
            for (float side : new float[]{-1f, 1f}) {
                drawQuad(point(-1.43f, .97f, side * .728f),
                        point(-.18f, .94f, side * .738f),
                        point(-.18f, 1.39f, side * .549f),
                        point(-1.00f, 1.39f, side * .549f), .13f, .19f, .25f);
                drawQuad(point(-.14f, .94f, side * .738f),
                        point(1.05f, .92f, side * .728f),
                        point(.23f, 1.39f, side * .539f),
                        point(-.14f, 1.39f, side * .549f), .17f, .24f, .30f);
                // Narrow B-pillar and bright upper window surround.
                drawQuad(point(-.19f, .93f, side * .748f),
                        point(-.12f, .93f, side * .748f),
                        point(-.12f, 1.40f, side * .555f),
                        point(-.19f, 1.40f, side * .555f), .08f, .10f, .13f);
                drawLine(point(-1.02f, 1.40f, side * .55f),
                        point(.24f, 1.42f, side * .55f), .014f, .73f, .75f, .77f);
            }
        }

        private void drawDetails() {
            for (float side : new float[]{-1f, 1f}) {
                float surface = side * .875f;
                // Dark rocker and wheel-arch trim frame the longer S05 wheelbase.
                drawQuad(point(-1.71f, .34f, surface), point(1.72f, .34f, surface),
                        point(1.61f, .25f, surface), point(-1.65f, .25f, surface),
                        .13f, .15f, .17f);
                drawLine(point(-1.57f, .76f, side * .857f),
                        point(1.34f, .72f, side * .855f), .008f, .71f, .73f, .75f);
                for (float door : new float[]{-.80f, .18f}) {
                    drawLine(point(door, .38f, side * .875f),
                            point(door, .82f, side * .875f), .007f, .52f, .55f, .58f);
                }
                for (float handle : new float[]{-.63f, .43f}) {
                    drawBox(handle, .77f, side * .871f, .085f, .008f, .008f,
                            .40f, .43f, .46f, 1f);
                }
                drawBox(.91f, .92f, side * .78f, .13f, .045f, .10f,
                        .08f, .10f, .12f, 1f);
                for (float axle : new float[]{-1.39f, 1.36f}) {
                    drawWheelArch(axle, side);
                    drawAeroWheel(axle, side);
                }
            }
            // Slim upper DRLs and separate lower lamp modules on the grilleless nose.
            for (float side : new float[]{-1f, 1f}) {
                drawQuad(point(2.122f, .72f, side * .30f),
                        point(2.096f, .73f, side * .62f),
                        point(2.091f, .69f, side * .62f),
                        point(2.125f, .70f, side * .30f), .88f, .95f, .98f);
                drawBox(2.151f, .52f, side * .52f, .012f, .055f, .105f,
                        .08f, .11f, .14f, 1f);
                drawBox(2.164f, .52f, side * .52f, .004f, .024f, .078f,
                        .77f, .88f, .94f, 1f);
            }
            drawBox(2.16f, .37f, 0, .014f, .074f, .43f, .10f, .12f, .14f, 1f);
            drawBox(-2.151f, .79f, 0, .014f, .020f, .61f, .68f, .06f, .07f, 1f);
            drawBox(-2.161f, .77f, 0, .006f, .008f, .53f, .96f, .20f, .16f, 1f);
            drawBox(-2.16f, .48f, 0, .009f, .095f, .29f, .14f, .17f, .19f, 1f);
        }

        private void drawWheelArch(float x, float side) {
            float[] vertices = new float[16 * 6 * 3];
            int index = 0;
            for (int i = 0; i < 16; i++) {
                double first = Math.PI * i / 16;
                double second = Math.PI * (i + 1) / 16;
                for (double[] value : new double[][]{{first, .43}, {second, .43},
                        {second, .48}, {first, .43}, {second, .48}, {first, .48}}) {
                    vertices[index++] = x + (float) Math.cos(value[0]) * (float) value[1];
                    vertices[index++] = .37f + (float) Math.sin(value[0]) * (float) value[1];
                    vertices[index++] = side * .90f;
                }
            }
            draw(vertices, GLES20.GL_TRIANGLES, .16f, .18f, .20f, 1f);
        }

        private void drawAeroWheel(float x, float side) {
            float z = side * .93f;
            drawDisc(x, .37f, z, .405f, .055f, .065f, .075f);
            drawDisc(x, .37f, z + side * .006f, .315f, .31f, .34f, .37f);
            drawDisc(x, .37f, z + side * .012f, .275f, .72f, .75f, .78f);
            float[] spokes = new float[5 * 6 * 3];
            int index = 0;
            for (int i = 0; i < 5; i++) {
                double angle = 2 * Math.PI * i / 5 + .2;
                for (double[] value : new double[][]{{angle - .15, .06}, {angle - .20, .26},
                        {angle + .04, .26}, {angle - .15, .06}, {angle + .04, .26},
                        {angle + .11, .06}}) {
                    spokes[index++] = x + (float) Math.cos(value[0]) * (float) value[1];
                    spokes[index++] = .37f + (float) Math.sin(value[0]) * (float) value[1];
                    spokes[index++] = z + side * .018f;
                }
            }
            draw(spokes, GLES20.GL_TRIANGLES, .15f, .18f, .21f, 1f);
            drawDisc(x, .37f, z + side * .025f, .067f, .60f, .63f, .66f);
        }

        private void drawDisc(float x, float y, float z, float radius,
                              float r, float g, float b) {
            float[] vertices = new float[32 * 3 * 3];
            int index = 0;
            for (int i = 0; i < 32; i++) {
                double first = Math.PI * 2 * i / 32;
                double second = Math.PI * 2 * (i + 1) / 32;
                index = append(vertices, index, point(x, y, z));
                index = append(vertices, index, point(x + (float) Math.cos(first) * radius,
                        y + (float) Math.sin(first) * radius, z));
                index = append(vertices, index, point(x + (float) Math.cos(second) * radius,
                        y + (float) Math.sin(second) * radius, z));
            }
            draw(vertices, GLES20.GL_TRIANGLES, r, g, b, 1f);
        }

        private void drawLine(float[] start, float[] end, float halfHeight,
                              float r, float g, float b) {
            drawQuad(point(start[0], start[1] - halfHeight, start[2]),
                    point(end[0], end[1] - halfHeight, end[2]),
                    point(end[0], end[1] + halfHeight, end[2]),
                    point(start[0], start[1] + halfHeight, start[2]), r, g, b);
        }

        private void drawQuad(float[] a, float[] b, float[] c, float[] d,
                              float r, float g, float blue) {
            draw(new float[]{a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2],
                    a[0], a[1], a[2], c[0], c[1], c[2], d[0], d[1], d[2]},
                    GLES20.GL_TRIANGLES, r, g, blue, 1f);
        }

        private float[] point(float x, float y, float z) {
            return new float[]{x, y, z};
        }

        private void drawBox(float x, float y, float z, float sx, float sy, float sz,
                             float r, float g, float b, float a) {
            float[] vertices = {
                    -1,-1,1, 1,-1,1, 1,1,1, -1,-1,1, 1,1,1, -1,1,1,
                    1,-1,-1, -1,-1,-1, -1,1,-1, 1,-1,-1, -1,1,-1, 1,1,-1,
                    -1,-1,-1, -1,-1,1, -1,1,1, -1,-1,-1, -1,1,1, -1,1,-1,
                    1,-1,1, 1,-1,-1, 1,1,-1, 1,-1,1, 1,1,-1, 1,1,1,
                    -1,1,1, 1,1,1, 1,1,-1, -1,1,1, 1,1,-1, -1,1,-1,
                    -1,-1,-1, 1,-1,-1, 1,-1,1, -1,-1,-1, 1,-1,1, -1,-1,1
            };
            for (int i = 0; i < vertices.length; i += 3) {
                vertices[i] = vertices[i] * sx + x;
                vertices[i + 1] = vertices[i + 1] * sy + y;
                vertices[i + 2] = vertices[i + 2] * sz + z;
            }
            draw(vertices, GLES20.GL_TRIANGLES, r, g, b, a);
        }

        private int append(float[] vertices, int offset, float[] point) {
            vertices[offset++] = point[0];
            vertices[offset++] = point[1];
            vertices[offset++] = point[2];
            return offset;
        }

        private void draw(float[] vertices, int mode, float r, float g, float b, float a) {
            FloatBuffer buffer = ByteBuffer.allocateDirect(vertices.length * 4)
                    .order(ByteOrder.nativeOrder()).asFloatBuffer();
            buffer.put(vertices).position(0);
            Matrix.multiplyMM(mvp, 0, view, 0, model, 0);
            Matrix.multiplyMM(mvp, 0, projection, 0, mvp, 0);
            GLES20.glUniformMatrix4fv(matrixHandle, 1, false, mvp, 0);
            GLES20.glUniform4f(colorHandle, r, g, b, a);
            GLES20.glEnableVertexAttribArray(positionHandle);
            GLES20.glVertexAttribPointer(positionHandle, 3, GLES20.GL_FLOAT, false, 0, buffer);
            GLES20.glDrawArrays(mode, 0, vertices.length / 3);
            GLES20.glDisableVertexAttribArray(positionHandle);
        }

        private static int linkProgram(String vertex, String fragment) {
            int vertexShader = compileShader(GLES20.GL_VERTEX_SHADER, vertex);
            int fragmentShader = compileShader(GLES20.GL_FRAGMENT_SHADER, fragment);
            int linked = GLES20.glCreateProgram();
            GLES20.glAttachShader(linked, vertexShader);
            GLES20.glAttachShader(linked, fragmentShader);
            GLES20.glLinkProgram(linked);
            int[] status = new int[1];
            GLES20.glGetProgramiv(linked, GLES20.GL_LINK_STATUS, status, 0);
            if (status[0] == 0) {
                String error = GLES20.glGetProgramInfoLog(linked);
                GLES20.glDeleteProgram(linked);
                throw new IllegalStateException("Unable to link concept renderer: " + error);
            }
            GLES20.glDeleteShader(vertexShader);
            GLES20.glDeleteShader(fragmentShader);
            return linked;
        }

        private static int compileShader(int type, String source) {
            int shader = GLES20.glCreateShader(type);
            GLES20.glShaderSource(shader, source);
            GLES20.glCompileShader(shader);
            int[] status = new int[1];
            GLES20.glGetShaderiv(shader, GLES20.GL_COMPILE_STATUS, status, 0);
            if (status[0] == 0) {
                String error = GLES20.glGetShaderInfoLog(shader);
                GLES20.glDeleteShader(shader);
                throw new IllegalStateException("Unable to compile concept renderer: " + error);
            }
            return shader;
        }
    }
}
