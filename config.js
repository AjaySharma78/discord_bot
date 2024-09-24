import dotenv from 'dotenv'
dotenv.config();

const config = {
   discordToken: String(process.env.DISCORD_TOKEN),
   discordUserId: String(process.env.DISCORD_USER_ID),
   mongoUrl: String(process.env.MONGO_USER),
   port: Number(process.env.PORT),
   mongopassword: String(process.env.MONGO_PASSWORD),
   urlEndPoint: String(process.env.ENDPOINT),
   openweatherKey: String(process.env.OPENWEATHER_API_KEY)
}
export default config