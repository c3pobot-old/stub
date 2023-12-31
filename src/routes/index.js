'use strict'
const Cmds = {}
Cmds.fetchArenaPlayers = require('./requests/getArenaPlayers')
Cmds.fetchGAPlayer = require('./fetchGAPlayer')
Cmds.fetchGuild = require('./fetchGuild')
Cmds.fetchGuildArena = require('./fetchGuildArena')
Cmds.fetchPlayer = require('./fetchPlayer')
Cmds.fetchTWGuild = require('./fetchTWGuild')
Cmds.getAllyCode = require('./getAllyCode')
Cmds.getArenaPlayer = require('./requests/getArenaPlayer')
Cmds.getGuildId = require('./requests/getGuildId')
Cmds.getGuildMemberLevel = require('./getGuildMemberLevel')
Cmds.getPlayer = require('./requests/getPlayer')
Cmds.getEnums = require('./getEnums')
Cmds.queryGuild = require('./requests/queryGuild')
Cmds.queryPlayer = require('./requests/queryPlayer')
Cmds.queryArenaPlayers = require('./queryArenaPlayers')
Cmds.queryGuildPlayers = require('./requests/queryGuildPlayers')
Cmds.updateGuild = require('./updateGuild')
module.exports = Cmds
