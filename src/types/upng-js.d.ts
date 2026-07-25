declare module 'upng-js' {
  const UPNG: {
    encode: (bufs: ArrayBuffer[], width: number, height: number, colors: number) => ArrayBuffer;
  };
  export default UPNG;
}
