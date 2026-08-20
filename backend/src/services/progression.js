function rankForXp(xp){if(xp>=5000)return "CHIEF INSPECTOR";if(xp>=3000)return "INSPECTOR";if(xp>=1500)return "SENIOR DETECTIVE";if(xp>=500)return "DETECTIVE";return "ROOKIE";}
module.exports={rankForXp};
