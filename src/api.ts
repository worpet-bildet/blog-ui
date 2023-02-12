import Urbit from '@urbit/http-api';
// TODO fix this later
const api = new Urbit('http://localhost', 'lidlut-tabwed-pillex-ridrup');
api.ship = 'zod';
// @ts-ignore TODO window typings
window.api = api

export default api