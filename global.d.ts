// CSS module declarations
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Allow importing CSS files as side effects (e.g. import '*.css')
declare module '*.css';
