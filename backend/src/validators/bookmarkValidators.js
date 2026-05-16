const { z } = require('zod');

const bookmarkSchema = z.object({
  url: z
    .string({ required_error: 'La URL es requerida' })
    .url('La URL no tiene un formato válido (debe incluir https://)')
    .trim(),
  title: z
    .string({ required_error: 'El título es requerido' })
    .min(1, 'El título es requerido')
    .max(100, 'El título no puede superar 100 caracteres')
    .trim(),
  description: z
    .string()
    .max(300, 'La descripción no puede superar 300 caracteres')
    .trim()
    .optional()
    .default(''),
});

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const errors = error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors,
    });
  }
};

module.exports = { bookmarkSchema, validate };
