const { NlpManager } = require("node-nlp");
const manager = new NlpManager();
const httpContext = require('express-http-context')
const uuid = require('uuid/v4')
const tm = require('../helper/trackingManager')
const kirimDataModel = require('../model/kirimData')
const moment = require('moment')
const helper = require('../helper/helper')
const _ = require("lodash")
const config = require("../constant").config;


module.exports = (controller) => {
	controller.plugins.cms.before("damcorpbot", "default", async(convo, bot) => {
		console.log("CONVERSATION STARTED", /* bot._config */ )
		console.log(convo.setVar('timestamp', new Date()));
		console.log(bot._config.activity.text)
	})

	controller.plugins.cms.onChange("damcorpbot", "answer_default", async(response, convo, bot) => {
		console.log(bot._config.activity.text);
		switch(response.toLowerCase()) {
            case '1' :
				case 'lanjut' :
                 await convo.gotoThread('_menu_utama')
			break
            default:
                await convo.gotoThread('default')
        }
	})
	
	controller.plugins.cms.onChange("damcorpbot", "answer_menu_utama", async(response, convo, bot) => {
		console.log(bot._config.activity.text);
		if (response.toLowerCase()) {
			await convo.setVar('nama', response)
			await convo.gotoThread('_simpan_perusahaan')
		} 
		else {
			convo.repeat()
		}

	})

	controller.plugins.cms.onChange("damcorpbot", "answer_simpan_perusahaan", async(response, convo, bot) => {
		console.log(bot._config.activity.text);
		if (response) {
			convo.setVar('perusahaan', response)
			convo.gotoThread('_email_valid')
		} 
		else {
			convo.repeat()
		}

	})

	controller.plugins.cms.onChange("damcorpbot", "answer_email_valid", async(response, convo, bot) => {
		console.log(bot._config.activity.text);
		let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

		if(response.match(mailFormat)){
			await convo.setVar('email', response)
			await convo.gotoThread('_simpan_lokasi')
			console.log('data berhasil disimpan');
			
		} 
		else {
			await convo.gotoThread('_email_salah')
		}		 
	})

		
	controller.plugins.cms.onChange("damcorpbot", "answer_simpan_lokasi", async(response, convo, bot) => {

		console.log(bot._config.activity.text);
		let msgType = bot._config.activity.messageType

		if (msgType == 'location') {
			await console.log('lokasi tersimpan')
			await convo.setVar('locations', response)
			await convo.gotoThread('_simpan_selfie')
			
		}
		else {
			await convo.gotoThread('_lokasi_salah')
		}
			
	})

	controller.plugins.cms.onChange("damcorpbot", "answer_foto_selfie", async(response, convo, bot) => {

			// foto selfie skip upload langsung hit postman
/*
		if(response) {
            await helper.api({
                method: "post",
                url: "https://private-65030d-dam7.apiary-mock.com/api/v1/bussines",
                data: {
                    phone : config.number
                    }
                })
                .then( async res => {
                const list = res.data.data.list;
                list.forEach((el,i) => {
                list[i] = `${i + 1}. ${el}`;
                })
                let dataList = 'Silahkan pilih kebutuhan Anda:\n\n' + list.join('\n');
                convo.setVar('listArr', list);
                convo.setVar('list',dataList);
                await convo.gotoThread('data_list');
            })
        }
        else {
            await convo.gotoThread('_simpan_selfie')
		}
		*/
    })
		




	// let variable = convo.vars
	// 	let msg = `Nama : ${variable.nama} , Perusahaan : ${variable.perusahaan}, Email : ${variable.email}, Lokasi : ${variable.locations}`

	// 	await kirimData(bot,msg)

	// function kirimData(bot, msg){
	// 	let now = moment().format()
	// 	let activity = bot._config.activity
	// 	kirimDataModel.create({
	// 		wa_id : activity.from.id,
	// 		message : msg,
	// 		timestamp : now
	// 	}).catch(err => {

	// 	})
	// }

	
	


}

