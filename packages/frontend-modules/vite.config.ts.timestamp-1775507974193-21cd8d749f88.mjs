// vite.config.ts
import path from "path";
import react from "file:///Users/m1max/IdeaProjects/infinitylooplabs/Platform/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { defineConfig } from "file:///Users/m1max/IdeaProjects/infinitylooplabs/Platform/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/m1max/IdeaProjects/infinitylooplabs/Platform/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/m1max/IdeaProjects/infinitylooplabs/Platform/packages/frontend-modules";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true
    })
  ],
  server: {
    host: "0.0.0.0",
    port: 4010
  },
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "@infinityloop.labs/frontend-modules",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@reduxjs/toolkit",
        "@infinityloop.labs/event-bus",
        "@infinityloop.labs/routing",
        "@infinityloop.labs/utils",
        "react-router",
        "react-redux",
        "@generated/hooks/auth"
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@reduxjs/toolkit": "ReduxToolkit",
          "@infinityloop.labs/event-bus": "InfinityloopLabsEventBus",
          "@infinityloop.labs/routing": "InfinityloopLabsRouting",
          "@infinityloop.labs/utils": "InfinityloopLabsUtils",
          "react-router": "ReactRouter",
          "react-redux": "ReactRedux",
          "@generated/hooks/auth": "GeneratedAuthHooks"
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbTFtYXgvSWRlYVByb2plY3RzL2luZmluaXR5bG9vcGxhYnMvUGxhdGZvcm0vcGFja2FnZXMvZnJvbnRlbmQtbW9kdWxlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL20xbWF4L0lkZWFQcm9qZWN0cy9pbmZpbml0eWxvb3BsYWJzL1BsYXRmb3JtL3BhY2thZ2VzL2Zyb250ZW5kLW1vZHVsZXMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL20xbWF4L0lkZWFQcm9qZWN0cy9pbmZpbml0eWxvb3BsYWJzL1BsYXRmb3JtL3BhY2thZ2VzL2Zyb250ZW5kLW1vZHVsZXMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3YydcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgZHRzKHtcbiAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXG4gICAgfSksXG4gIF0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICBwb3J0OiA0MDEwLFxuICB9LFxuICBidWlsZDoge1xuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2luZGV4LnRzJyksXG4gICAgICBuYW1lOiAnQGluZmluaXR5bG9vcC5sYWJzL2Zyb250ZW5kLW1vZHVsZXMnLFxuICAgICAgZm9ybWF0czogWydlcycsICd1bWQnXSxcbiAgICAgIGZpbGVOYW1lOiBmb3JtYXQgPT4gYGluZGV4LiR7Zm9ybWF0fS5qc2AsXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogW1xuICAgICAgICAncmVhY3QnLFxuICAgICAgICAncmVhY3QtZG9tJyxcbiAgICAgICAgJ0ByZWR1eGpzL3Rvb2xraXQnLFxuICAgICAgICAnQGluZmluaXR5bG9vcC5sYWJzL2V2ZW50LWJ1cycsXG4gICAgICAgICdAaW5maW5pdHlsb29wLmxhYnMvcm91dGluZycsXG4gICAgICAgICdAaW5maW5pdHlsb29wLmxhYnMvdXRpbHMnLFxuICAgICAgICAncmVhY3Qtcm91dGVyJyxcbiAgICAgICAgJ3JlYWN0LXJlZHV4JyxcbiAgICAgICAgJ0BnZW5lcmF0ZWQvaG9va3MvYXV0aCcsXG4gICAgICBdLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICByZWFjdDogJ1JlYWN0JyxcbiAgICAgICAgICAncmVhY3QtZG9tJzogJ1JlYWN0RE9NJyxcbiAgICAgICAgICAnQHJlZHV4anMvdG9vbGtpdCc6ICdSZWR1eFRvb2xraXQnLFxuICAgICAgICAgICdAaW5maW5pdHlsb29wLmxhYnMvZXZlbnQtYnVzJzogJ0luZmluaXR5bG9vcExhYnNFdmVudEJ1cycsXG4gICAgICAgICAgJ0BpbmZpbml0eWxvb3AubGFicy9yb3V0aW5nJzogJ0luZmluaXR5bG9vcExhYnNSb3V0aW5nJyxcbiAgICAgICAgICAnQGluZmluaXR5bG9vcC5sYWJzL3V0aWxzJzogJ0luZmluaXR5bG9vcExhYnNVdGlscycsXG4gICAgICAgICAgJ3JlYWN0LXJvdXRlcic6ICdSZWFjdFJvdXRlcicsXG4gICAgICAgICAgJ3JlYWN0LXJlZHV4JzogJ1JlYWN0UmVkdXgnLFxuICAgICAgICAgICdAZ2VuZXJhdGVkL2hvb2tzL2F1dGgnOiAnR2VuZXJhdGVkQXV0aEhvb2tzJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlaLE9BQU8sVUFBVTtBQUMxYSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBSGhCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLElBQUk7QUFBQSxNQUNGLGtCQUFrQjtBQUFBLElBQ3BCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsS0FBSztBQUFBLE1BQ0gsT0FBTyxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQzdDLE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxNQUNyQixVQUFVLFlBQVUsU0FBUyxNQUFNO0FBQUEsSUFDckM7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxPQUFPO0FBQUEsVUFDUCxhQUFhO0FBQUEsVUFDYixvQkFBb0I7QUFBQSxVQUNwQixnQ0FBZ0M7QUFBQSxVQUNoQyw4QkFBOEI7QUFBQSxVQUM5Qiw0QkFBNEI7QUFBQSxVQUM1QixnQkFBZ0I7QUFBQSxVQUNoQixlQUFlO0FBQUEsVUFDZix5QkFBeUI7QUFBQSxRQUMzQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
