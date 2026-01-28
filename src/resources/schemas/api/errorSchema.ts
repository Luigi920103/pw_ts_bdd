import Joi from "joi"

export const fiveHundredErrorSchema = Joi.object({
  data: Joi.object().required(),
  success: Joi.boolean().required(),
  message: Joi.string().required(),
})

export const reportsErrorSchema_400 = Joi.object({
  data: Joi.object({
    error: Joi.array()
      .items(
        Joi.object({
          code: Joi.string().required(),
          expected: Joi.string().optional(),
          received: Joi.string().optional().allow(""),
          validation: Joi.string().optional(),
          path: Joi.array()
            .items(Joi.alternatives().try(Joi.string(), Joi.number()))
            .required(),
          message: Joi.string().required(),
          options: Joi.array().items(Joi.string()).optional(),
        }),
      )
      .required(),
  }).required(),
  success: Joi.boolean().required(),
  message: Joi.string().required(),
})

export const unauthorized_401 = Joi.object({
  success: Joi.boolean().required(),
  message: Joi.string().required(),
})
