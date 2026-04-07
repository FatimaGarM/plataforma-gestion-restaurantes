/**
 * Wrapper de fetch que añade automáticamente el header Authorization
 * con el token Basic Auth guardado en localStorage al hacer login.
 * Si el servidor devuelve 401, limpia la sesión y redirige al login.
 */
export function authFetch(url, options = {}) {
    const auth = localStorage.getItem("auth");
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            ...(auth ? { "Authorization": auth } : {})
        }
    }).then(res => {
        if (res.status === 401) {
            localStorage.removeItem("auth");
            localStorage.removeItem("usuario");
            const path = window.location.pathname;
            if (path !== "/login" && path !== "/") {
                window.location.href = "/login";
            }
        }
        return res;
    });
}
