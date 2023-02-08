//Sistema de economia

const profileSchema = require('@schemas/profile-schema')

const coinsCache = {} // { 'guildId-userId': coins }

module.exports = (client) => {}

module.exports.addCoins = async (userId, coins) => {
  console.log('Rodando findOneAndUpdate()')

  const user = await profileSchema.findOne({ userId: userId })

  await profileSchema.findOneAndUpdate(
    { userId: userId },
    { $set: { coins: user.coins + coins } }
  )

  return user.coins
}

module.exports.addBank = async (userId, coins) => {
  const user = await profileSchema.findOne({ userId: userId })

  await profileSchema.findOneAndUpdate(
    { userId: userId },
    { $set: { bank: user.bank + coins } }
  )

  return user.bank
}

module.exports.getCoins = async (userId) => {
  const doc = await profileSchema.findOne({ userId: userId })

  const coins = doc.coins
  return coins
}
