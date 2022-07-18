//Manda uma foto de gatinho pela api
const Command = require('@util/structures/Command')
const config = require('../../config.json')
const querystring = require('querystring')
const r2 = require('r2')
const DOG_API_URL = 'https://api.thedogapi.com/'
const DOG_API_KEY = config.dogKey // get a free key from - https://thedogapi.com/signup

module.exports = class DogCommand extends Command {
  constructor(client) {
    super(client)
    this.client = client

    this.name = 'dog'
    this.category = 'Misc'
    this.description = 'Comando para mandar a foto de um catioro'
    this.usage = 'dog'
    this.aliases = ['cachorro']

    this.enabled = true
    this.guildOnly = true
  }

  async run({ message, args, prefix, author }) {
    // pass the name of the user who sent the message for stats later, expect an array of images to be returned.
    var images = await loadImage(message.author.username)

    // get the Image, and first Breed from the returned object.
    const index = Math.floor(Math.random() * images.length)
    var image = images[index]

    // use the *** to make text bold, and * to make italic
    message.reply({ files: [image.url] })
  }
}

async function loadImage(sub_id) {
  // you need an API key to get access to all the iamges, or see the requests you've made in the stats for your account
  var headers = {
    'X-API-KEY': DOG_API_KEY,
  }
  var query_params = {
    has_breeds: true, // we only want images with at least one breed data object - name, temperament etc
    mime_types: 'jpg,png', // we only want static images as Discord doesn't like gifs
    size: 'small', // get the small images as the size is prefect for Discord's 390x256 limit
    sub_id: sub_id, // pass the message senders username so you can see how many images each user has asked for in the stats
    limit: 1, // only need one
  }
  // convert this obejc to query string
  let queryString = querystring.stringify(query_params)

  try {
    // construct the API Get request url
    let _url = DOG_API_URL + `v1/images/search?${queryString}`
    // make the request passing the url, and headers object which contains the API_KEY
    var response = await r2.get(_url, { headers }).json
  } catch (e) {
    console.log(e)
  }
  return response
}
