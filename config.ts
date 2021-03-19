import dotenv from "dotenv";
import dotenvParseVariables from "dotenv-parse-variables";

const env = dotenv.config();

export default dotenvParseVariables(env.parsed);
