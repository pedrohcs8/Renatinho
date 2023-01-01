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
  console.log('Rodando findOneAndUpdate()')

  const user = await profileSchema.findOne({ userId: userId })

  await profileSchema.findOneAndUpdate(
    { userId: userId },
    { $set: { bank: user.bank + coins } }
  )

  return user.bank
}

module.exports.getCoins = async (guildId, userId) => {
  const cachedValue = coinsCache[`${guildId}-${userId}`]
  if (cachedValue) {
    return cachedValue
  }

  console.log('Rodando findOne()')

  const result = await profileSchema.findOne({
    guildId,
    userId,
  })

  let coins = 0
  if (result) {
    coins = result.coins
  } else {
    console.log('Inserting a document')
    await new profileSchema({
      guildId,
      userId,
      coins,
    }).save()
  }

  coinsCache[`${guildId}-${userId}`] = coins

  return coins
}
