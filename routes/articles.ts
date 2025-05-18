import Router, {RouterContext} from "koa-router";
import bodyParser from "koa-bodyparser";
import * as model from '../models/articles';
import {validateArticle} from '../controllers/validation';
import { basicAuth } from '../controllers/auth'; // Import the basicAuth middleware

const router = new Router({prefix: '/api/v1/articles'});


// Now we define the handler functions
const getAll = async (ctx: RouterContext, next: any)=> {
    let articles = await model.getAll();
    if (articles.length) {
        ctx.body = articles;
    } else {
        ctx.body = {}
    }
    await next();
}
const getById = async (ctx: RouterContext, next: any) => {
    let id = ctx.params.id;
    let article = await model.getById(id);
    if (article.length) {
    ctx.body = article[0];
    } else {
    ctx.status = 404;
    }
    await next();
}

const createArticle = async (ctx: RouterContext, next: any) => {
 const body = ctx.request.body;
 let result = await model.add(body);
 if (result.status == 201) {
 ctx.status = 201;
 ctx.body = body;
 } else {
 ctx.status = 500;
 ctx.body = {err: "insert data failed"};
 }
 await next();
}

const updateArticle = async (ctx: RouterContext, next: any) => {
    let id = +ctx.params.id;
      //let {title, fullText} = ctx.request.body;
      let c: any = ctx.request.body;
      
      let result = await model.update(c,id)
      if (result) {
        ctx.status = 201
        ctx.body = `Article with id ${id} updated` 
      } 
      await next();
}

const deleteArticle = async (ctx: RouterContext, next: any) => {
 let id = +ctx.params.id;
  
 let article = await model.deleteById(id)
   ctx.status=201
     ctx.body = `Article with id ${id} deleted`
   await next();
}

// Public routes
router.get('/', getAll);
router.get('/:id([0-9]{1,})', getById);

// Protected routes (require authentication)
router.post('/', basicAuth, bodyParser(), validateArticle, createArticle);
router.put('/:id([0-9]{1,})', basicAuth, bodyParser(), validateArticle, updateArticle);
router.del('/:id([0-9]{1,})', basicAuth, deleteArticle);
export { router };