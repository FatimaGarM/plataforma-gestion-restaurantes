import { useIdioma } from "../context/IdiomaContext";

function Footer() {
  const { t } = useIdioma();
  return (
    <footer className="bg-white border-t border-gray-200 mt-10 py-6">

      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">

        {/* LINKS */}
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-800 transition">
            {t("footer.avisoLegal")}
          </a>
          <a href="#" className="hover:text-gray-800 transition">
            {t("footer.privacidad")}
          </a>
          <a href="#" className="hover:text-gray-800 transition">
            {t("footer.cookies")}
          </a>
        </div>

        {/* COPYRIGHT */}
        <p className="text-center md:text-right">
          © 2026 Gestión Restaurante QR
        </p>

      </div>

    </footer>
  );
}

export default Footer;