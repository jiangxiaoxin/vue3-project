const shader = `
varying float vAlpha;
varying float vColor;

void main()
{
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05/distanceToCenter - 0.1;
    // gl_FragColor = vec4(1.0, 1.0, 1.0, strength * vAlpha);
    if(vColor == 0.0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0 ,  strength * vAlpha);
    } else {
    gl_FragColor = vec4(0.0, 0.0, vColor ,  strength * vAlpha);
    }
    
}
`

export default shader