function Footer() {
  return (
    <footer className="bg-orange-200 border-t mt-10 py-4">

      <div className="flex flex-col items-center text-sm gap-2">

        <div className="flex gap-6">
          <a href="#">Aviso legal</a>
          <a href="#">Política de privacidad</a>
          <a href="#">Política de cookies</a>
        </div>

        <p className="text-gray-600">
          Copyright © Todos los derechos reservados 2026 Gestión - Restaurante QR
        </p>

      </div>

    </footer>
  );
}

export default Footer;