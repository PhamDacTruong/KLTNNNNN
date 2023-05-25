const db = require("../models")
require('dotenv').config();

let createSpecialty = async (data) => {
    return new Promise( async (resolve, reject) => {
        try{
            if(!data.name || !data.imageBase64 || !data.descriptionMarkdown || !data.descriptionHTML ){
                resolve({
                    errCode : 1,
                    errMessage : 'Missing parameter'
                })

            }else{
                await db.Specialty.create({
                    name : data.name,
                    image : data.imageBase64,
                    descriptionMarkdown : data.descriptionMarkdown,
                    descriptionHTML : data.descriptionHTML

                })
                resolve({
                    errCode : 0,
                    errMessage : 'ok'
                })
            }

           
        }catch(e){
            reject(e);
        }
    }
    )}



    
let getAllSpecialty = async (data) => {
    return new Promise( async (resolve, reject) => {
        try{
            let data =  await db.Specialty.findAll({
            });
            if( data && data.length > 0){
                data.map(item => {
                    item.image = new Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
                
            }
                resolve({
                    errCode : 0,
                    errMessage : 'ok',
                    data
                })
            
          
        }catch(e){
            reject(e);
        }
    }
    )
}

let getDetailSpecialtyById = async (inputId, location) => {
    return new Promise( async (resolve, reject) => {
        try{
            if(!inputId || !location){
                resolve({
                    errCode : 1,
                    errMessage : 'Missing parameter'
                })

            }else{
                 let data = await db.Specialty.findOne({
                    where : {
                        id : inputId
                    },
                    attributes : ['descriptionHTML','descriptionMarkdown']
                })
                if(data){
                    let doctorSpecialty = [];
                    if(location === 'ALL'){
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where : { specialtyId : inputId },
                            attributes : ['doctorId','provinceId']
                        })
                    }else{
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where : { specialtyId : inputId, provinceId : location },
                            attributes : ['doctorId','provinceId']
                        })
                    }
                    



                    data.doctorSpecialty = doctorSpecialty;
    
                   }else data = {}
                   resolve({
                    errCode : 0,
                    errMessage : 'ok',
                    data
                    })
           
               
            }
               
          
        }catch(e){
            reject(e);
        }
    }
    )
}


module.exports = {
    createSpecialty : createSpecialty,
    getAllSpecialty : getAllSpecialty,
    getDetailSpecialtyById : getDetailSpecialtyById
}