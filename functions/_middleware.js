export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  if (url.hostname === 'www.tourpick360.com') {
    url.hostname = 'tourpick360.com';
    return Response.redirect(url.toString(), 301);
  }

  return next();
}
