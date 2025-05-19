// File: components/ContentForm.js
"use client";
import styles from "./ContentForm.module.css";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import estadosMexico from "@/utils/estados";
import { getCurrentDate } from "@/utils/getCurrentDate";
import { sanitizeFilename } from "@/utils/sanitizeFilename";

export default function ContentForm() {
  const data = {};
  const [formData, setFormData] = useState({
    NOMBRE: "",
    ESTADO: "",
    MUNICIPIO: "",
    AUTORIZACION: "",
    PROFPIC: "",
    PDF: "",
  });
  const [downloadURL, setDownloadURL] = useState("");
  const [profileImageURL, setProfileImageURL] = useState("/images/PROFILE.png");
  const [loadingProfileImage, setLoadingProfileImage] = useState(false);
  const [loadingMembership, setLoadingMembership] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const tableRef = useRef();
  const form = useRef(null);

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingProfileImage(true);
    const sanitizedFileName = sanitizeFilename(file.name);
    const filename = `doc_${Date.now()}_${sanitizedFileName}`;

    const { data, error } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME)
      .upload(`profiles/${filename}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Image upload error:', error);
      setLoadingProfileImage(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME)
      .getPublicUrl(`profiles/${filename}`);

    if (urlData?.publicUrl) {
      setProfileImageURL(urlData.publicUrl);
      setFormData(prev => ({
        ...prev,
        PROFPIC: urlData.publicUrl,
      }));
    }
    setLoadingProfileImage(false);
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const sanitizedFileName = sanitizeFilename(file.name);
    const filename = `doc_${Date.now()}_${sanitizedFileName}`;
    const { data, error } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME)
      .upload(`documents/${filename}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("PDF Upload Error:", error);
      return;
    }

    const { data: urlData } = supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME)
      .getPublicUrl(`documents/${filename}`);

    if (urlData?.publicUrl) {
      setFormData((prev) => ({
        ...prev,
        PDF: urlData.publicUrl,
      }));
    }
  };

  const handleSaveAsPNG = async () => {
    const html2canvas = (await import("html2canvas")).default;
    const element = document.getElementById("tarjeta");
    const randomString = Math.random().toString(36).substring(2, 18);
    const timestamp = Date.now();
    const filename = `${timestamp}_${randomString}_Curativa.png`;

    try {
      const canvas = await html2canvas(element, { scale: 4, useCORS: true, allowTaint: false });

      canvas.toBlob(async (blob) => {
        if (blob) {
          const { data, error } = await supabase.storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME)
            .upload(`membership/${filename}`, blob, {
              quality: 1,
              scale: 4,
              cacheControl: '3600',
              upsert: false,
            });

          if (error) {
            setLoadingMembership(false);
            throw error;
          }

          const { data: urlData } = supabase.storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME)
            .getPublicUrl(`membership/${filename}`);

          if (!urlData?.publicUrl) {
            setLoadingMembership(false);
            throw new Error("Failed to retrieve public URL");
          }

          setDownloadURL(urlData.publicUrl);
          setUploadSuccess(true);
        }
      }, 'image/png', 0.98);
    } catch (error) {
      setLoadingMembership(false);
      console.log("Error:", error);
    }
  };

  const handleChange = (e) => {
    setUploadSuccess(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoadingMembership(true);
    e.preventDefault();
    data.formData = formData;
    await handleSaveAsPNG();
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <form className={`${styles.formMembership}`} onSubmit={handleSubmit} ref={form}>
      <div className="grid-cols-2 mt-10 lg:grid justify-items-center">
        <div className="w-full p-2 mx-auto mb-10 bg-white rounded-lg shadow-2xl lg:w-4/5">
          <div className="w-full bg-white">
            <div className="px-8 pt-6 pb-8 mb-4 bg-white">
              <label htmlFor="profileUpload" className="block mt-4 mb-2 text-sm font-bold">
                FOTO DE PERFIL:<span className="font-light text-red-500"> *</span>
              </label>
              <input id="profileUpload" type="file" accept="image/*" onChange={handleProfileImageUpload} className="w-full" required />

              <label htmlFor="NOMBRE" className="block mb-2 text-sm font-bold">
                NOMBRE:<span className="font-light text-red-500"> *</span>
              </label>
              <input name="NOMBRE" type="text" onChange={handleChange} maxLength={30} className="w-full px-3 py-2 border shadow appearance-none" required />

              <label htmlFor="ESTADO" className="block mt-2 mb-2 text-sm font-bold">
                ESTADO:<span className="font-light text-red-500"> *</span>
              </label>
              <select id="ESTADO" name="ESTADO" value={formData.ESTADO} onChange={handleChange} className="w-full px-3 py-2 border shadow appearance-none" required>
                <option value="">Selecciona un estado</option>
                {estadosMexico.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>

              <label htmlFor="MUNICIPIO" className="block mt-2 mb-2 text-sm font-bold">
                MUNICIPIO:<span className="font-light text-red-500"> *</span>
              </label>
              <input name="MUNICIPIO" type="text" onChange={handleChange} maxLength={18} className="w-full px-3 py-2 border shadow appearance-none" required />

              <label htmlFor="pdfUpload" className="block mt-4 mb-2 text-sm font-bold">
                DOCUMENTO (PDF):<span className="font-light text-red-500"> *</span>
              </label>
              <input
                id="pdfUpload"
                type="file"
                accept="application/pdf"
                onChange={handlePDFUpload}
                className="w-full"
                required
              />


              <label htmlFor="AUTORIZACION" className="block mt-2 mb-2 text-sm font-bold">
                AUTORIZACIÓN:<span className="font-light text-red-500"> *</span>
              </label>
              <input name="AUTORIZACION" type="text" onChange={handleChange} maxLength={18} className="w-full px-3 py-2 border shadow appearance-none" required />
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className={`${styles.membership}`} ref={tableRef} id="tarjeta">
            <img className="w-full" src="/images/TARJETA_FINAL_BACK.png" />
            <table className="bg-custom-card rounded-2xl">
              <tbody>
                <tr className="flex w-full h-full">
                  <td className="flex flex-col justify-around w-2/3 h-full pt-6 pb-5 pl-6">
                    <img src="/images/Logo-CUSACAN-HEADER.png" alt="CUSACAN" className="w-full" />
                    <div>
                      <p className="py-0 my-0 leading-4 text-left"><span className="font-bold">Nombre: </span><span className="capitalize">{formData.NOMBRE}</span></p>
                      <p className="py-0 my-0 leading-4 text-left"><span className="font-bold">Estado: </span><span className="capitalize">{formData.ESTADO}</span></p>
                      <p className="py-0 my-0 leading-4 text-left"><span className="font-bold">Municipio: </span><span className="capitalize">{formData.MUNICIPIO}</span></p>
                      <p className="py-0 my-0 leading-4 text-left break-all">
                        <span className="font-bold">Documento: </span>
                        {formData.PDF ? (
                          (() => {
                            const urlParts = formData.PDF.split("/");
                            const fileName = urlParts[urlParts.length - 1];
                            const baseName = fileName.replace(".pdf", "");
                            const shortName = baseName.slice(-24) + ".pdf";
                            return (
                              <a href={formData.PDF} target="_blank" rel="noopener noreferrer" className="underline ">
                                {shortName}
                              </a>
                            );
                          })()
                        ) : (
                          <span className="">No disponible</span>
                        )}
                      </p>
                      <p className="py-0 my-0 leading-4 text-left"><span className="font-bold">Fecha Creada: </span>{getCurrentDate()}</p>
                      <p className="py-0 my-0 leading-4 text-left whitespace-nowrap "><span className="font-bold">Autorización: </span><span className="text-sm uppercase md:text-base">{formData.AUTORIZACION}</span></p>
                    </div>
                    <h1 className="pt-2 text-xs font-bold text-center md:pt-5 md:text-xl">#PRESERVANDORAICES</h1>
                    <div className="flex justify-around gap-5 pt-2">
                      <img className="w-1/6" src="/images/MORADO_LOGO.png" alt="CUSACAN" />
                      <div className="flex flex-col w-5/6 bg-white">
                        <img className="w-full" src="/images/BARCODE.jpg" />
                        <p style={{ padding: 0 }} className="text-xs text-center">Curativa Salud Cannabis</p>
                      </div>
                    </div>
                    <span className={`${styles.membership}`}>WWW.CURATIVASALUDCANNABIS.ORG</span>
                  </td>
                  <td className={`${styles.socio} flex flex-col items-center justify-around pb-5 pr-8 pt-6 pl-5 w-1/3`}>
                    <div className="flex flex-col items-center">
                      {loadingProfileImage ? (
                        <p className="text-sm ">Cargando imagen...</p>
                      ) : (
                        <img className="w-full rounded-2xl" src={profileImageURL} alt="Perfil" />
                      )}
                      <p className="pt-5 font-bold text-left whitespace-nowrap">ASOCIADO</p>
                    </div>
                    <img className="w-2/3" src="/images/QR.jpg" alt="QR" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="pt-5 text-center">Esta representación es lo mas cercano posible a la tarjeta final</p>
          <div className="flex flex-col items-center mt-6">
            <div className="flex flex-col justify-center w-full mb-4">
              {!uploadSuccess && (
                <>{loadingMembership ? <p className="text-sm text-center">Generando membresía...</p> : <button type="submit" className="block px-4 py-2 m-auto text-xs tracking-widest text-center text-white uppercase bg-black shadow cursor-pointer whitespace-nowrap font-formaBold w-min md:text-sm">Generar PDF</button>}</>
              )}
              {uploadSuccess && (
                <>
                  <p className="text-center">Membresía creada correctamente!</p>
                  <a href={downloadURL} target="_blank" rel="noopener noreferrer" className="w-full font-bold text-center underline break-all">Descarga tu membresía</a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}