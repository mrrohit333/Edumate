/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/documents/route";
exports.ids = ["app/api/documents/route"];
exports.modules = {

/***/ "(rsc)/./app/api/documents/route.ts":
/*!************************************!*\
  !*** ./app/api/documents/route.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_1__);\n\n\n// Define a schema for your documents (must match the one in upload/route.ts)\nconst documentSchema = new (mongoose__WEBPACK_IMPORTED_MODULE_1___default().Schema)({\n    name: {\n        type: String,\n        required: true\n    },\n    size: {\n        type: Number,\n        required: true\n    },\n    type: {\n        type: String,\n        required: true\n    },\n    uploadDate: {\n        type: Date,\n        default: Date.now\n    },\n    filePath: {\n        type: String,\n        required: true\n    }\n});\n// Create a model based on the schema (must match the one in upload/route.ts)\nconst Document = (mongoose__WEBPACK_IMPORTED_MODULE_1___default().models).Document || mongoose__WEBPACK_IMPORTED_MODULE_1___default().model('Document', documentSchema);\n// MongoDB connection status\nlet isConnected = false;\nconst connectDB = async ()=>{\n    if (isConnected) {\n        console.log('Using existing database connection');\n        return;\n    }\n    try {\n        await mongoose__WEBPACK_IMPORTED_MODULE_1___default().connect(process.env.MONGODB_URI);\n        isConnected = true;\n        console.log('MongoDB connected');\n    } catch (error) {\n        console.error('MongoDB connection error:', error);\n        isConnected = false;\n        throw new Error('Database connection failed');\n    }\n};\nasync function GET() {\n    try {\n        await connectDB(); // Ensure database connection\n        // Fetch all documents from the database, including the filePath\n        const documents = await Document.find({}).sort({\n            uploadDate: -1\n        });\n        console.log(`Fetched ${documents.length} documents from MongoDB.`);\n        // Map documents to include the fileUrl for the frontend\n        const documentsWithFileUrl = documents.map((doc)=>({\n                _id: doc._id,\n                name: doc.name,\n                size: doc.size,\n                type: doc.type,\n                uploadDate: doc.uploadDate,\n                fileUrl: `${\"http://localhost:3000\" || 0}${doc.filePath}` // Make URL absolute\n            }));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            documents: documentsWithFileUrl\n        });\n    } catch (error) {\n        console.error('Fetch documents error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: false,\n            message: error.message || 'Failed to fetch documents.'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2RvY3VtZW50cy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTJDO0FBQ1g7QUFFaEMsNkVBQTZFO0FBQzdFLE1BQU1FLGlCQUFpQixJQUFJRCx3REFBZSxDQUFDO0lBQ3pDRyxNQUFNO1FBQUVDLE1BQU1DO1FBQVFDLFVBQVU7SUFBSztJQUNyQ0MsTUFBTTtRQUFFSCxNQUFNSTtRQUFRRixVQUFVO0lBQUs7SUFDckNGLE1BQU07UUFBRUEsTUFBTUM7UUFBUUMsVUFBVTtJQUFLO0lBQ3JDRyxZQUFZO1FBQUVMLE1BQU1NO1FBQU1DLFNBQVNELEtBQUtFLEdBQUc7SUFBQztJQUM1Q0MsVUFBVTtRQUFFVCxNQUFNQztRQUFRQyxVQUFVO0lBQUs7QUFDM0M7QUFFQSw2RUFBNkU7QUFDN0UsTUFBTVEsV0FBV2Qsd0RBQWUsQ0FBQ2MsUUFBUSxJQUFJZCxxREFBYyxDQUFDLFlBQVlDO0FBRXhFLDRCQUE0QjtBQUM1QixJQUFJZ0IsY0FBYztBQUVsQixNQUFNQyxZQUFZO0lBQ2hCLElBQUlELGFBQWE7UUFDZkUsUUFBUUMsR0FBRyxDQUFDO1FBQ1o7SUFDRjtJQUNBLElBQUk7UUFDRixNQUFNcEIsdURBQWdCLENBQUNzQixRQUFRQyxHQUFHLENBQUNDLFdBQVc7UUFDOUNQLGNBQWM7UUFDZEUsUUFBUUMsR0FBRyxDQUFDO0lBQ2QsRUFBRSxPQUFPSyxPQUFPO1FBQ2ROLFFBQVFNLEtBQUssQ0FBQyw2QkFBNkJBO1FBQzNDUixjQUFjO1FBQ2QsTUFBTSxJQUFJUyxNQUFNO0lBQ2xCO0FBQ0Y7QUFFTyxlQUFlQztJQUNwQixJQUFJO1FBQ0YsTUFBTVQsYUFBYSw2QkFBNkI7UUFFaEQsZ0VBQWdFO1FBQ2hFLE1BQU1VLFlBQVksTUFBTWQsU0FBU2UsSUFBSSxDQUFDLENBQUMsR0FBR0MsSUFBSSxDQUFDO1lBQUVyQixZQUFZLENBQUM7UUFBRTtRQUVoRVUsUUFBUUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFUSxVQUFVRyxNQUFNLENBQUMsd0JBQXdCLENBQUM7UUFFakUsd0RBQXdEO1FBQ3hELE1BQU1DLHVCQUF1QkosVUFBVUssR0FBRyxDQUFDQyxDQUFBQSxNQUFRO2dCQUNqREMsS0FBS0QsSUFBSUMsR0FBRztnQkFDWmhDLE1BQU0rQixJQUFJL0IsSUFBSTtnQkFDZEksTUFBTTJCLElBQUkzQixJQUFJO2dCQUNkSCxNQUFNOEIsSUFBSTlCLElBQUk7Z0JBQ2RLLFlBQVl5QixJQUFJekIsVUFBVTtnQkFDMUIyQixTQUFTLEdBQUdkLHVCQUFnQyxJQUFJLENBQUUsR0FBR1ksSUFBSXJCLFFBQVEsRUFBRSxDQUFDLG9CQUFvQjtZQUMxRjtRQUVBLE9BQU9kLHFEQUFZQSxDQUFDdUMsSUFBSSxDQUFDO1lBQUVDLFNBQVM7WUFBTVgsV0FBV0k7UUFBcUI7SUFFNUUsRUFBRSxPQUFPUCxPQUFZO1FBQ25CTixRQUFRTSxLQUFLLENBQUMsMEJBQTBCQTtRQUN4QyxPQUFPMUIscURBQVlBLENBQUN1QyxJQUFJLENBQUM7WUFBRUMsU0FBUztZQUFPQyxTQUFTZixNQUFNZSxPQUFPLElBQUk7UUFBNkIsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDckg7QUFDRiIsInNvdXJjZXMiOlsiRDpcXE1JTklcXGVkdW1hdGUtM2QtaW5zdHJ1Y3RvclxcYXBwXFxhcGlcXGRvY3VtZW50c1xccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcblxuLy8gRGVmaW5lIGEgc2NoZW1hIGZvciB5b3VyIGRvY3VtZW50cyAobXVzdCBtYXRjaCB0aGUgb25lIGluIHVwbG9hZC9yb3V0ZS50cylcbmNvbnN0IGRvY3VtZW50U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XG4gIG5hbWU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxuICBzaXplOiB7IHR5cGU6IE51bWJlciwgcmVxdWlyZWQ6IHRydWUgfSxcbiAgdHlwZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXG4gIHVwbG9hZERhdGU6IHsgdHlwZTogRGF0ZSwgZGVmYXVsdDogRGF0ZS5ub3cgfSwgLy8gRGF0ZSBvZiB1cGxvYWRcbiAgZmlsZVBhdGg6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LCAvLyBJbmNsdWRlIGZpbGVQYXRoIGZyb20gdXBsb2FkIHNjaGVtYVxufSk7XG5cbi8vIENyZWF0ZSBhIG1vZGVsIGJhc2VkIG9uIHRoZSBzY2hlbWEgKG11c3QgbWF0Y2ggdGhlIG9uZSBpbiB1cGxvYWQvcm91dGUudHMpXG5jb25zdCBEb2N1bWVudCA9IG1vbmdvb3NlLm1vZGVscy5Eb2N1bWVudCB8fCBtb25nb29zZS5tb2RlbCgnRG9jdW1lbnQnLCBkb2N1bWVudFNjaGVtYSk7XG5cbi8vIE1vbmdvREIgY29ubmVjdGlvbiBzdGF0dXNcbmxldCBpc0Nvbm5lY3RlZCA9IGZhbHNlO1xuXG5jb25zdCBjb25uZWN0REIgPSBhc3luYyAoKSA9PiB7XG4gIGlmIChpc0Nvbm5lY3RlZCkge1xuICAgIGNvbnNvbGUubG9nKCdVc2luZyBleGlzdGluZyBkYXRhYmFzZSBjb25uZWN0aW9uJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgYXdhaXQgbW9uZ29vc2UuY29ubmVjdChwcm9jZXNzLmVudi5NT05HT0RCX1VSSSBhcyBzdHJpbmcpO1xuICAgIGlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICBjb25zb2xlLmxvZygnTW9uZ29EQiBjb25uZWN0ZWQnKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdNb25nb0RCIGNvbm5lY3Rpb24gZXJyb3I6JywgZXJyb3IpO1xuICAgIGlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhYmFzZSBjb25uZWN0aW9uIGZhaWxlZCcpO1xuICB9XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKCkge1xuICB0cnkge1xuICAgIGF3YWl0IGNvbm5lY3REQigpOyAvLyBFbnN1cmUgZGF0YWJhc2UgY29ubmVjdGlvblxuXG4gICAgLy8gRmV0Y2ggYWxsIGRvY3VtZW50cyBmcm9tIHRoZSBkYXRhYmFzZSwgaW5jbHVkaW5nIHRoZSBmaWxlUGF0aFxuICAgIGNvbnN0IGRvY3VtZW50cyA9IGF3YWl0IERvY3VtZW50LmZpbmQoe30pLnNvcnQoeyB1cGxvYWREYXRlOiAtMSB9KTtcblxuICAgIGNvbnNvbGUubG9nKGBGZXRjaGVkICR7ZG9jdW1lbnRzLmxlbmd0aH0gZG9jdW1lbnRzIGZyb20gTW9uZ29EQi5gKTtcblxuICAgIC8vIE1hcCBkb2N1bWVudHMgdG8gaW5jbHVkZSB0aGUgZmlsZVVybCBmb3IgdGhlIGZyb250ZW5kXG4gICAgY29uc3QgZG9jdW1lbnRzV2l0aEZpbGVVcmwgPSBkb2N1bWVudHMubWFwKGRvYyA9PiAoe1xuICAgICAgX2lkOiBkb2MuX2lkLFxuICAgICAgbmFtZTogZG9jLm5hbWUsXG4gICAgICBzaXplOiBkb2Muc2l6ZSxcbiAgICAgIHR5cGU6IGRvYy50eXBlLFxuICAgICAgdXBsb2FkRGF0ZTogZG9jLnVwbG9hZERhdGUsXG4gICAgICBmaWxlVXJsOiBgJHtwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19CQVNFX1VSTCB8fCAnJ30ke2RvYy5maWxlUGF0aH1gIC8vIE1ha2UgVVJMIGFic29sdXRlXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgZG9jdW1lbnRzOiBkb2N1bWVudHNXaXRoRmlsZVVybCB9KTtcblxuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgY29uc29sZS5lcnJvcignRmV0Y2ggZG9jdW1lbnRzIGVycm9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiBmYWxzZSwgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGZldGNoIGRvY3VtZW50cy4nIH0sIHsgc3RhdHVzOiA1MDAgfSk7XG4gIH1cbn0gIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsIm1vbmdvb3NlIiwiZG9jdW1lbnRTY2hlbWEiLCJTY2hlbWEiLCJuYW1lIiwidHlwZSIsIlN0cmluZyIsInJlcXVpcmVkIiwic2l6ZSIsIk51bWJlciIsInVwbG9hZERhdGUiLCJEYXRlIiwiZGVmYXVsdCIsIm5vdyIsImZpbGVQYXRoIiwiRG9jdW1lbnQiLCJtb2RlbHMiLCJtb2RlbCIsImlzQ29ubmVjdGVkIiwiY29ubmVjdERCIiwiY29uc29sZSIsImxvZyIsImNvbm5lY3QiLCJwcm9jZXNzIiwiZW52IiwiTU9OR09EQl9VUkkiLCJlcnJvciIsIkVycm9yIiwiR0VUIiwiZG9jdW1lbnRzIiwiZmluZCIsInNvcnQiLCJsZW5ndGgiLCJkb2N1bWVudHNXaXRoRmlsZVVybCIsIm1hcCIsImRvYyIsIl9pZCIsImZpbGVVcmwiLCJORVhUX1BVQkxJQ19CQVNFX1VSTCIsImpzb24iLCJzdWNjZXNzIiwibWVzc2FnZSIsInN0YXR1cyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/documents/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdocuments%2Froute&page=%2Fapi%2Fdocuments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdocuments%2Froute.ts&appDir=D%3A%5CMINI%5Cedumate-3d-instructor%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMINI%5Cedumate-3d-instructor&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdocuments%2Froute&page=%2Fapi%2Fdocuments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdocuments%2Froute.ts&appDir=D%3A%5CMINI%5Cedumate-3d-instructor%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMINI%5Cedumate-3d-instructor&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_MINI_edumate_3d_instructor_app_api_documents_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/documents/route.ts */ \"(rsc)/./app/api/documents/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/documents/route\",\n        pathname: \"/api/documents\",\n        filename: \"route\",\n        bundlePath: \"app/api/documents/route\"\n    },\n    resolvedPagePath: \"D:\\\\MINI\\\\edumate-3d-instructor\\\\app\\\\api\\\\documents\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_MINI_edumate_3d_instructor_app_api_documents_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZkb2N1bWVudHMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmRvY3VtZW50cyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmRvY3VtZW50cyUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDTUlOSSU1Q2VkdW1hdGUtM2QtaW5zdHJ1Y3RvciU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9RCUzQSU1Q01JTkklNUNlZHVtYXRlLTNkLWluc3RydWN0b3ImaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ2M7QUFDM0Y7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkQ6XFxcXE1JTklcXFxcZWR1bWF0ZS0zZC1pbnN0cnVjdG9yXFxcXGFwcFxcXFxhcGlcXFxcZG9jdW1lbnRzXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9kb2N1bWVudHMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9kb2N1bWVudHNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2RvY3VtZW50cy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkQ6XFxcXE1JTklcXFxcZWR1bWF0ZS0zZC1pbnN0cnVjdG9yXFxcXGFwcFxcXFxhcGlcXFxcZG9jdW1lbnRzXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdocuments%2Froute&page=%2Fapi%2Fdocuments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdocuments%2Froute.ts&appDir=D%3A%5CMINI%5Cedumate-3d-instructor%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMINI%5Cedumate-3d-instructor&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdocuments%2Froute&page=%2Fapi%2Fdocuments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdocuments%2Froute.ts&appDir=D%3A%5CMINI%5Cedumate-3d-instructor%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CMINI%5Cedumate-3d-instructor&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();