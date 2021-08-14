// self.addEventListener("fetch", (event) => {
//   if (event.method === "POST") return;
//   event.respondWith(
//     caches.open("stale").then(async (cache) => {
//       const response = await cache.match(event.request);
//       var fetchPromise = fetch(event.request).then((networkResponse) => {
//         cache.put(event.request, networkResponse.clone());
//         return networkResponse;
//       });
//       return response || fetchPromise;
//     })
//   );
// });
