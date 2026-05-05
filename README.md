# 🚀 Offiwiz AI Report Generator

Prototipo de herramienta interna para generar informes ejecutivos a partir de archivos de registro (Logs/CSV) utilizando Inteligencia Artificial.

## 🛠️ Arquitectura y Tecnologías
Este proyecto utiliza una arquitectura *Serverless* para mantener un coste operativo de 0€ durante la fase de validación:
* **Frontend:** HTML5, CSS3, JavaScript puro + Tailwind/Librerías externas.
* **Hosting Frontend:** Vercel / GitHub Pages.
* **Backend & Automatización:** Make.com (Webhooks).
* **Inteligencia Artificial:** Google Gemini 1.5 API (Procesamiento de datos y NLP).

## ⚙️ El Flujo de Trabajo (Backend)
Toda la lógica de procesamiento de datos ocurre en la nube sin sobrecargar el navegador del usuario. 

![Flujo de Make](workflow.png)

1. **Recepción (Webhook):** Captura el archivo binario enviado por el usuario.
2. **Procesamiento AI:** El motor de Gemini convierte el binario a texto, analiza los datos mecánicos/operativos y redacta un informe estructurado.
3. **Respuesta (Webhook Response):** Devuelve el informe en formato Markdown al frontend en cuestión de segundos.

*(Nota: En los archivos del repositorio se incluye el archivo `workflow-make.json` por si se desea importar e inspeccionar el escenario en Make).*
