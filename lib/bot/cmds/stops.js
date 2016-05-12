'use strict';

const Utils = require('../../../lib/utils/Utils'),
    HttpWrap = require('../../../lib/utils/HttpWrap'),
    TextLib = require('../../../lib/utils/TextLib'),
    cheerio = require('cheerio'),
    https = require('https');

const routes ={
  "1": "1&From=Santry%20(Shanard%20Rd.)%20Towards=%20Sandymount%20(St.%20John's%20Church)&Direction=",
  "4": "4&From=%20Harristown%20Towards=Monkstown%20Avenue&Direction=",
  "7": "7&From=%20Mountjoy%20Sq.%20Towards=%20Loughlinstown/Cherrywood&Direction=",
  "7b": "7b&From=%20Mountjoy%20Sq.%20Towards=%20Shankill&Direction=",
  "7d": "7d&From=%20Mountjoy%20Sq.%20Towards=Dalkey&Direction=",
  "7n": "7n&From=%20D'Olier%20St.%20Towards=%20Shankill&Direction=",
  "8": "8&From=%20Mountjoy%20Sq.%20Towards=%20Dalkey&Direction=",
  "9": "9&From=%20Charlestown%20Towards=Limekiln%20Ave.&Direction=",
  "11": "11&From=%20Wadelai%20Park%20Towards=%20Sandyford%20Business%20District&Direction=",
  "13": "13&From=%20Harristown%20Towards=Grange%20Castle&Direction=",
  "14": "14&From=%20Beaumont%20(Ardlea%20Rd.)%20Towards=Dundrum%20Luas%20Station&Direction=",
  "15": "15&From=%20Clongriffin%20Towards=%20Ballycullen%20Rd.&Direction=",
  "15a": "15a&From=%20Grand%20Canal%20Dock%20(Benson%20St.)%20Towards=%20Limekiln%20Ave.&Direction=",
  "15b": "15b&From=%20Grand%20Canal%20Dock%20(Benson%20St.)%20Towards=%20Stocking%20Ave.&Direction=",
  "15n": "15n&From=%20D'Olier%20St.%20Towards=%20Ellensborough&Direction=",
  "16": "16&From=%20Dublin%20Airport%20Towards=Ballinteer%20(Kingston)&Direction=",
  "17": "17&From=Rialto%20to%20Blackrock&Direction=",
  "17a": "17a&From=%20Blanchardstown%20Centre%20Towards=%20Kilbarrack&Direction=",
  "18": "18&From=%20Palmerstown%20(Old%20Lucan%20Rd.)%20Towards=%20Sandymount&Direction=",
  "25": "25&From=%20Merrion%20Sq.%20to%20Lucan%20(Dodsboro)&Direction=",
  "25a": "25a&From=%20Merrion%20Sq.%20Towards=%20Lucan%20(Esker%20Church)&Direction=",
  "25b": "25b&From=%20Merrion%20Sq.%20Towards=Adamstown%20Rail%20Station&Direction=",
  "25n": "25n&From=%20Westmoreland%20St.%20Towards=%20Adamstown&Direction=",
  "25x": "25x&From=%20UCD%20Belfield%20Towards=Lucan&Direction=",
  "26": "26&From=%20Merrion%20Sq.%20Towards=%20Palmerstown%20(Cemetery)&Direction=",
  "27": "27&From=%20Clare%20Hall%20Towards=%20Jobstown&Direction=",
  "27a": "27a&From=%20Eden%20Quay%20Towards=%20Blunden%20Drive&Direction=",
  "27b": "27b&From=Eden%20Quay%20Towards=%20Harristown&Direction=",
  "27x": "27x&From=%20UCD%20Belfield%20Towards=Clare%20Hall&Direction=",
  "29a": "29a&From=%20Lwr.%20Abbey%20St.%20Towards=Baldoyle%20(Coast%20Rd.)&Direction=",
  "29n": "29n&From=%20D'Olier%20St.%20Towards=%20Baldoyle%20Road&Direction=",
  "31": "31&From=Talbot%20St.%20Towards=Howth%20Summit&Direction=",
  "31b": "31b&From=%20Talbot%20St.%20Towards=Howth%20Summit&Direction=",
  "31n": "31n&From=D'Olier%20St.%20to%20Howth&Direction=",
  "32": "32&From=%20Talbot%20St.%20Towards=Malahide&Direction=",
  "32x": "32x&From=%20Malahide%20Towards=UCD%20Belfield&Direction=",
  "33": "33&From=%20Lower%20Abbey%20St.%20Towards=Balbriggan&Direction=",
  "33a": "33a&From=Swords%20Towards=Balbriggan&Direction=",
  "33b": "33b&From=Swords%20to%20Portrane&Direction=",
  "33d": "33d&From=%20Custom%20House%20Quay%20/%20St.%20Stephen's%20Green%20Towards=Portrane&Direction=",
  "33n": "33n&From=Westmoreland%20St.%20to%20Balbriggan&Direction=",
  "33x": "33x&From=%20Custom%20House%20Quay%20/%20St.%20Stephen's%20Green%20Towards=Skerries&Direction=",
  "37": "37&From=%20Baggot%20St.%20/%20Wilton%20Terrace%20Towards=%20Blanchardstown%20Centre&Direction=",
  "38": "38&From=%20Burlington%20Rd.%20Towards=%20Damastown&Direction=",
  "38a": "38a&From=%20Burlington%20Rd.%20Towards=Damastown&Direction=",
  "38b": "38b&From=%20Burlington%20Rd.%20Towards=%20Damastown&Direction=",
  "39": "39&From=%20Burlington%20Rd.%20Towards=%20Ongar&Direction=",
  "39a": "39a&From=%20UCD%20Belfield%20Towards=%20Ongar&Direction=",
  "39n": "39n&From=%20Westmoreland%20St.%20Towards=%20Tyrrelstown&Direction=",
  "40": "40&From=%20Finglas%20Village%20Towards=%20Liffey%20Valley%20Shopping%20Centre&Direction=",
  "40b": "40b&From=%20Parnell%20St.%20Towards=Toberburr&Direction=",
  "40d": "40d&From=%20Parnell%20St.%20Towards=Tyrrelstown&Direction=",
  "41": "41&From=Lower%20Abbey%20St.%20Towards=%20Swords%20Manor&Direction=",
  "41b": "41b&From=%20Lower%20Abbey%20St.%20Towards=Rolestown&Direction=",
  "41c": "41c&From=Lower%20Abbey%20St.%20Towards=%20Swords%20Manor&Direction=",
  "41n": "41n&From=%20Westmoreland%20St.%20Towards=%20Swords%20Manor&Direction=",
  "41x": "41x&From=%20UCD%20Belfield%20Towards=%20Swords%20Manor&Direction=",
  "42": "42&From=%20Talbot%20St.%20Towards=Sand's%20Hotel%20(Portmarnock)&Direction=",
  "42n": "42n&From=%20D'Olier%20St.%20Towards=%20Portmarnock&Direction=",
  "43": "43&From=%20Talbot%20St.%20Towards=%20Swords%20Business%20Park&Direction=",
  "44": "44&From=%20DCU%20Towards=%20Enniskerry&Direction=",
  "44b": "44b&From=Dundrum%20Luas%20Station%20Towards=%20Glencullen&Direction=",
  "45a": "45a&From=Dún%20Laoghaire%20(Rail%20Station)%20Towards=%20Kilmacanogue&Direction=",
  "46a": "46a&From=Phoenix%20Park%20Towards=%20Dún%20Laoghaire&Direction=",
  "46e": "46e&From=%20Blackrock%20Station%20Towards=%20Mountjoy%20Sq.&Direction=",
  "46n": "46n&From=%20D'Olier%20St.%20Towards=%20Dundrum&Direction=",
  "47": "47&From=%20Poolbeg%20St.%20Towards=Belarmine&Direction=",
  "49": "49&From=%20Pearse%20St.%20Towards=%20Tallaght%20(The%20Square)&Direction=",
  "49n": "49n&From=%20D'Olier%20St.%20Towards=%20Tallaght%20(Kilnamanagh)&Direction=",
  "51d": "51d&From=%20Aston%20Quay%20Towards=%20Clondalkin&Direction=",
  "51x": "51x&From=%20Dunawley%20Towards=UCD%20Belfield&Direction=",
  "53": "53&From=%20Talbot%20St.%20Towards=%20Dublin%20Ferryport&Direction=",
  "54a": "54a&From=%20Pearse%20St.Towards=%20Ellensborough%20/%20Kiltipper%20Way&Direction=",
  "56a": "56a&From=%20Ringsend%20Rd.%20Towards=%20Tallaght%20(The%20Square)&Direction=",
  "59": "59&From=Dún%20Laoghaire%20to%20Mackintosh%20Park&Direction=",
  "61": "61&From=%20Eden%20Quay%20Towards=Whitechurch&Direction=",
  "63": "63&From=%20Dun%20Laoghaire%20Towards=%20Kilternan&Direction=",
  "65": "65&From=%20Poolbeg%20St.%20Towards=Blessington%20/%20Ballymore&Direction=",
  "65b": "65b&From=%20Poolbeg%20St.%20Towards=%20Citywest&Direction=",
  "66": "66&From=%20Merrion%20Sq.%20Towards=%20Maynooth&Direction=",
  "66a": "66a&From=%20Merrion%20Sq.%20Towards=Leixlip%20(Captain's%20Hill)&Direction=",
  "66b": "66b&From=%20Merrion%20Sq.%20Towards=Leixlip%20(Castletown)&Direction=",
  "66n": "66n&From=%20Westmoreland%20St.%20Towards=%20Leixlip%20(Louisa%20Bridge)%20via%20Glen%20Easton&Direction=",
  "66x": "66x&From=%20UCD%20Belfield%20Towards=Maynooth&Direction=",
  "67": "67&From=%20Merrion%20Sq.%20Towards=Maynooth&Direction=",
  "67n": "67n&From=%20Westmoreland%20St.%20Towards=%20Celbridge%20/%20Maynooth&Direction=",
  "67x": "67x&From=%20UCD%20Belfield%20Towards=Celbridge%20(Salesian%20College)&Direction=",
  "68": "68&From=/a%20%20From%20Fleet%20St.%20Towards=%20Newcastle%20/%20Greenogue%20Business%20Park&Direction=",
  "69": "69&From=%20Fleet%20St.%20Towards=%20Rathcoole&Direction=",
  "69n": "69n&From=%20Westmoreland%20St.%20Towards=%20Saggart&Direction=",
  "69x": "69x&From=%20Fleet%20St.%20Towards=Rathcoole&Direction=",
  "70": "70&From=%20Burlington%20Rd.%20Towards=%20Dunboyne&Direction=",
  "70n": "70n&From=Westmoreland%20St.%20Towards=%20Dunboyne&Direction=",
  "75": "75&From=The%20Square%20Tallaght%20to%20Dun%20Laoghaire&Direction=",
  "76": "76&From=%20Chapelizod%20Towards=%20Tallaght%20(The%20Square)&Direction=",
  "76a": "76a&From=%20Blanchardstown%20Centre%20Towards=%20Tallaght%20(The%20Square)&Direction=",
  "77a": "77a&From=%20Ringsend%20Rd.%20Towards=%20Citywest&Direction=",
  "77n": "77n&From=%20D'Olier%20St.%20Towards=%20Tallaght%20(Westbrook%20Estate)&Direction=",
  "77x": "77x&From=%20Citywest%20Towards=UCD%20Belfield&Direction=",
  "79": "79&From=/a%20%20Aston%20Quay%20to%20Spiddal%20Park%20/%20Park%20West%20(79a)&Direction=",
  "83": "83&From=%20Harristown%20Towards=Kimmage&Direction=",
  "84": "84&From=/a%20%20From%20Blackrock%20Towards=%20Newcastle&Direction=",
  "84n": "84n&From=D'Olier%20St.%20Towards=%20Greystones&Direction=",
  "84x": "84x&From=%20Pearse%20St.%20Towards=Newcastle%20/%20Kilcoole&Direction=",
  "88n": "88n&From=Westmoreland%20St.%20Towards=%20Ashbourne&Direction=",
  "90": "90&From=%20Heuston%20Station%20Towards=International%20Financial%20Services%20Centre&Direction=",
  "102": "102&From=Sutton%20Station%20to%20Dublin%20Airport&Direction=",
  "104": "104&From=Clontarf%20Rd.%20(Conquer%20Hill)%20Towards=DCU&Direction=",
  "111": "111&From=Loughlinstown%20Park%20to%20Dún%20Laoghaire&Direction=",
  "114": "114&From=%20Ticknock%20Towards=%20Blackrock%20Station&Direction=",
  "116": "116&From=%20Parnell%20Sq.%20to%20Whitechurch&Direction=",
  "118": "118&From=%20Kilternan%20Towards=%20D'Olier%20St.&Direction=",
  "120": "120&From=%20Parnell%20St.%20Towards=Ashtown%20Rail%20Station&Direction=",
  "122": "122&From=%20Ashington%20Towards=Drimnagh%20Rd.&Direction=",
  "123": "123&From=%20Walkinstown%20(Kilnamanagh%20Rd.)%20Towards=Marino&Direction=",
  "130": "130&From=%20Lwr.%20Abbey%20St.%20Towards=Castle%20Ave.&Direction=",
  "140": "140&From=%20Palmerston%20Park%20Towards=Finglas%20(Ikea)&Direction=",
  "142": "142&From=%20Portmarnock%20Towards=%20UCD%20Belfield&Direction=",
  "145": "145&From=%20Heuston%20Rail%20Station%20Towards=%20Ballywaltrim&Direction=",
  "150": "150&From=%20Fleet%20St.%20Towards=%20Rossmore&Direction=",
  "151": "151&From=%20Docklands%20(East%20Rd.)%20Towards=Foxborough%20(Balgaddy%20Rd.)&Direction=",
  "161": "161&From=%20Dundrum%20Luas%20Station%20Towards=Rockbrook/Tibradden&Direction=",
  "184": "184&From=%20Bray%20Rail%20Station%20Towards=%20Newtownmountkennedy&Direction=",
  "185": "185&From=Bray%20Rail%20Station%20Towards=%20Shop%20River&Direction=",
  "220": "220&From=%20Ballymun%20(Shangan%20Rd.)%20Towards=%20Lady's%20Well%20Rd.&Direction=",
  "236": "236&From=%20Blanchardstown%20Centre%20Towards=Damastown&Direction=",
  "238": "238&From=%20Tyrrelstown%20Towards=%20Lady's%20Well%20Rd.&Direction=",
  "239": "239&From=%20Blanchardstown%20Centre%20Towards=%20Liffey%20Valley%20Shopping%20Centre&Direction=",
  "270": "270&From=%20Blanchardstown%20Centre%20Towards=%20Dunboyne&Direction=",
  "747": "747&From=%20Heuston%20Rail%20Station%20Towards=%20Dublin%20Airport&Direction="
};

const stopsCommands = {
  route: function(input, bot) {
    var route_num = input.params.split(' ');
    var route_dir ="/DublinBus-Mobile/RTPI-Stops/?routeNumber=";

    if ((route_num[1]) && route_num[1] == "reverse"){
      route_dir = route_dir + routes[route_num[0]] + "O";
    }
    else{
      route_dir = route_dir + routes[route_num[0]] + "I";
    }
    process.stdout.write(route_dir + '\n');

    var options = {
      hostname: 'dublinbus.ie',
      port: 443,
      path: route_dir,
      method: 'GET',
      input: input,
      bot: bot
    };

    var req = https.request(options, function(res) {
      var responseString = '';
      res.on('data', function(data) {
        responseString += data;
      });

      res.on('end', function(){
        //process.stdout.write(responseString +'\n')
        var parsedHTML = cheerio.load(responseString);
        //process.stdout.write(parsedHTML('div.results-box .result a') + '\nend\n')
        parsedHTML('div.results-box .result a').each(function(){
          options.response += JSON.stringify(parsedHTML(this).text()).replace(/\\r?\\n/g, '').
          replace(/\\t/g, '').replace(/\s\s+/g, ' ').replace(/"/g, '\n');
          var stopnum = (options.response).replace(/Stop\s(\d*).*/g, '$1');
          //process.stdout.write(stopnum);
        });
        process.stdout.write('\nend\n')
        stopsCommands.showInfoCallback(options)
      });
    });
    req.end();
  },

  stop: function(input, bot) {
    var stop_num = input.params.split(' ');
    var query = '/DublinBus-Mobile/Real-Time-Info/?RTPISearch=stops&stopnumber=' + stop_num[0];

    var options = {
      hostname: 'dublinbus.ie',
      port: 443,
      path: query,
      method: 'GET',
      input: input,
      bot: bot
    };
    process.stdout.write(stop_num[0] + '\n')
    var req = https.request(options, function(res) {
      var responseString = '';
      res.on('data', function(data) {
        responseString += data;
        process.stdout.write('on\n')
      });

      res.on('end', function(){
        var parsedHTML = cheerio.load(responseString);
        //process.stdout.write(parsedHTML('div.results-info') + '\nend\n')
        parsedHTML('div.AspNet-GridView table.results-data tr').each(function(){
          options.response += JSON.stringify(parsedHTML(this).text()).replace(/\\r?\\n/g, '').
          replace(/\\t/g, '').replace(/\s\s+/g, ' ').replace(/"/g, '\n');
          //process.stdout.write(options.response);
        });
        process.stdout.write('\nend\n')
        stopsCommands.showInfoCallback(options)
      });
    });
    req.end();
    //process.stdout.write('req end \n')
  },

  // called back from apiCall so can't use Global GBot here
  // blob:
  //      response
  //      bot
  //      input
  showInfoCallback: function(blob) {
    // in case we want to filter the message
    process.stdout.write('\callback\n')
    //process.stdout.write(blob.response);

    blob.bot.say(blob.response, blob.input.message.room);
  }
};

module.exports = stopsCommands;
