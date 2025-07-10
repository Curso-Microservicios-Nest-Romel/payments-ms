import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  MP_SECRET: string;
  MP_SUCCESS_URL: string;
  MP_FAILURE_URL: string;
  MP_PENDING_URL: string;
}

const envsSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required(),
    MP_SECRET: joi.string().required(),
    MP_SUCCESS_URL: joi.string().uri().required(),
    MP_FAILURE_URL: joi.string().uri().required(),
    MP_PENDING_URL: joi.string().uri().required(),
  })
  .unknown(true); // Allow additional properties

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envsVars: EnvVars = value;

export const envs = {
  PORT: envsVars.PORT,
  MP_SECRET: envsVars.MP_SECRET,
  MP_SUCCESS_URL: envsVars.MP_SUCCESS_URL,
  MP_FAILURE_URL: envsVars.MP_FAILURE_URL,
  MP_PENDING_URL: envsVars.MP_PENDING_URL,
};
