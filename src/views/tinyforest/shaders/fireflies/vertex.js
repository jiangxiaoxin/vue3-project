const shader = `
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;


attribute float aScale;
varying float vAlpha;
varying float vColor;

void main()
{
    // 模型坐标
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += tan(uTime + modelPosition.x * 100.0 * aScale) ;
    // 世界坐标
    vec4 viewPosition =  viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    // 投影坐标
    gl_Position = projectionPosition;
    gl_PointSize = uSize*aScale*uPixelRatio;
    gl_PointSize *= (1.0/ -viewPosition.z) ; // ？ 这里为啥确定.z 是负数

    // 点的位置太高了，或者太低了，就透明，看不见
    vAlpha = (modelPosition.y > modelPosition.x * 2.5 || modelPosition.y < 0.0 ) ? 0.0 : 1.0;
    
    vColor = viewPosition.z > 0.0 ? 0.0 : 1.0;

}
`
export default shader