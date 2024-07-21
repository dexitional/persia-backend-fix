var db = require('../../config/mysql');

module.exports.ALU = {
   
   // ALUMNI MODELS

   fetchAlumni : async () => {
      const res = await db.query("select * from ehub_alumni.member order by id desc");
      return res;
   },

   insertAlumni : async (data) => {
      const res = await db.query("insert into ehub_alumni.member set ?",[data]);
      return res;
   },

   updateAlumni : async (id,data) => {
      const res = await db.query("update ehub_alumni.member set ? where id = ?",[ data, session_id]);
      return res;
   },

   deleteAlumni : async (session_id) => {
      const res = await db.query("delete from ehub_alumni.member where id = ?",[session_id]);
      return res;
   },

   
   getAlumniRefNo : async (cid) => {
      const res = await db.query("select (country_count+1) as country_count from ehub_alumni.member where country_id = ? order by id desc limit 1",[cid]);
      if(res && res.length > 0) return `${res[0].country_count}`;
      return null;
   },

   checkUser : async (email,phone) => {
      const res = await db.query("select * from ehub_alumni.member where email = ? or  phone = ?",[email,phone]);
      return res;
   },
  



  
   
};

