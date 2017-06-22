using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using FloorDesigner.Context;
using FloorDesigner.Models;

namespace FloorDesigner.Controllers
{
    public class FloorsController : ApiController
    {
        private IkeaDB db = new IkeaDB();

        // GET: api/Floors
        public IQueryable<Floor> GetFloors()
        {
            var foo = db.Floors.Include(t => t.Rooms).ToList();
            return foo.AsQueryable();
        }

        // GET: api/Floors/5
        [ResponseType(typeof(Floor))]
        public IHttpActionResult GetFloor(int id)
        {
            Floor floor = db.Floors.Find(id);
            if (floor == null)
            {
                return NotFound();
            }

            return Ok(floor);
        }

        // PUT: api/Floors/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutFloor(int id, Floor floor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != floor.Id)
            {
                return BadRequest();
            }


            List<Room> rl = db.Rooms.Where(r => r.FloorId == floor.Id).ToList();

            if(rl.Count > 0)
            {
                db.Rooms.RemoveRange(rl);
            }

            db.Rooms.AddRange(floor.Rooms);

            db.Entry(floor).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FloorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            //var dbf = db.Floors
            //           .Include(x => x.Rooms)
            //           .Single(c => c.Id == floor.Id);

            //db.Entry(dbf).CurrentValues.SetValues(floor);
            //db.Entry(dbf.Rooms).CurrentValues.SetValues(floor.Rooms);

            //db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Floors
        [ResponseType(typeof(Floor))]
        public IHttpActionResult PostFloor(Floor floor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Floors.Add(floor);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = floor.Id }, floor);
        }

        // DELETE: api/Floors/5
        [ResponseType(typeof(Floor))]
        public IHttpActionResult DeleteFloor(int id)
        {
            Floor floor = db.Floors.Find(id);
            if (floor == null)
            {
                return NotFound();
            }

            db.Floors.Remove(floor);
            db.SaveChanges();

            return Ok(floor);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool FloorExists(int id)
        {
            return db.Floors.Count(e => e.Id == id) > 0;
        }
    }
}