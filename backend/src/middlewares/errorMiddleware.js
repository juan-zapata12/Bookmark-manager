// Controlador de errores global — evita caídas del servicio
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  // Error de duplicado en MongoDB (ej: email ya registrado)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `El ${field} '${err.keyValue[field]}' ya está registrado.`;
    statusCode = 409;
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ success: false, message: 'Error de validación', errors });
  }

  // Error de Cast (ID inválido de MongoDB)
  if (err.name === 'CastError') {
    message = `ID inválido: ${err.value}`;
    statusCode = 400;
  }

  // Log en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('💥 ERROR:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Middleware para rutas no encontradas
const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
