# Usa nginx como base para servir los estáticos
FROM nginx:alpine

# Copia los archivos estáticos exportados por Next.js
COPY out /usr/share/nginx/html
# Copia la configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf
# Copia el entrypoint para inyectar variables de entorno en runtime
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80 