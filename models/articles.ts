import * as db from '../helpers/database';

//get a single article by its id
export const getById = async (id: any) => {
 let query = "SELECT * FROM articles WHERE ID = ?"
 let values = [id]
 let data = await db.run_query(query, values);
 return data;
}

//list all the articles in the database
export const getAll = async () => {
 // TODO: use page, limit, order to give pagination
 let query = "SELECT * FROM articles;"
 let data = await db.run_query(query, null);
 return data;
}

//create a new article in the database
export const add = async (article: any) => {
 let keys = Object.keys(article);
 let values = Object.values(article);
 let key = keys.join(',');
 let param = '';
 for(let i: number=0; i<values.length; i++){ param +='?,'}
 param=param.slice(0,-1);
 let query = `INSERT INTO articles (${key}) VALUES (${param})`;
 try{
 await db.run_insert(query, values);
 return {status: 201};
 } catch(err: any) {
 return err;
 }
}

export const  update= async(article:any,id:any)  =>{  
    
  //console.log("article " , article)
 // console.log("id ",id)
  let keys = Object.keys(article)
  let values = Object.values(article)  
  let updateString=""
  for(let i: number = 0; i<values.length;i++){updateString+=keys[i]+"="+"'"+values[i]+"'"+"," }
 updateString= updateString.slice(0, -1)
 // console.log("updateString ", updateString)
  let query = `UPDATE articles SET ${updateString} WHERE ID=${id} RETURNING *;`
  try{
   await db.run_query(query, values)  
    return {"status": 201}
  } catch(error) {
    return error
  }
}

export const deleteById = async (id:any) => {
  let query = "Delete FROM articles WHERE ID = ?"
  let values = [id]
  let data = await db.run_query(query, values)
  return data
}
