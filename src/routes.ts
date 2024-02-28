/**
 * Una variedad de rutas que son accesibles al público.
 * Estas rutas no requieren autenticación
 * @type {string[]}
 */
export const publicRoutes = ["/"];

/**
 * Una serie de rutas que se utilizan para la autenticación.
 * Estas rutas redireccionarán a los usuarios registrados a /settings
 * @type {string[]}
 */
export const authRoutes = ["/auth/login", "/auth/register", "/auth/error"];

/**
 * El prefijo para las rutas de autenticación API
 * Las rutas que comienzan con este prefijo se utilizan para fines de autenticación API
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * La ruta de redireccionamiento predeterminada después de iniciar sesión
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
