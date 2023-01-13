import { Router, Request, Response } from "express";
import { Item } from "./item"

//hard-coded data (not coming from a database)
let itemArray:Item[] = [
    { id: 1, quantity: 20, price: 10, product: "Eggs"},
    { id: 2, quantity: 5, price: 15, product: "Quinoa"},
    { id: 3, quantity: 2, price: 20.75, product: "Steak"},
    { id: 4, quantity: 2000, price: 1.2, product: "Gum"}
];

export const itemRouter = Router();

itemRouter.get("/", async (req:Request, res:Response) : Promise<Response> => {
    if(req.query.maxPrice !== undefined){
        let underArray = itemArray.filter((x) => x.price <= Number(req.query.maxPrice));
        return res.status(200).json(underArray);
    }
    else if(req.query.prefix !== undefined){
        let startsWithArray = itemArray.filter((x) => x.product.startsWith(String(req.query.prefix)));
        return res.status(200).json(startsWithArray);
    }
    else if(req.query.pageSize !== undefined){
        let listOfItems = itemArray.slice(0, Number(req.query.pageSize));
        return res.status(200).json(listOfItems);
    }
    else{
        return res.status(200).json(itemArray);
    }
});

itemRouter.get("/:id", async (req:Request, res:Response) : Promise<Response> => {
    let itemIWantToFind = itemArray.find((x) => x.id === Number(req.params.id));
        if(itemIWantToFind === undefined){
            return res.status(404).send("ID not found");
        }
        else{
            return res.status(200).json(itemIWantToFind);
        };
});

itemRouter.post("/", async (req:Request, res:Response) : Promise<Response> => {
    let newItem:Item = {
        id: GetNextId(),
        product: String(req.body.product),
        price: Number(req.body.price),
        quantity: Number(req.body.quantity)
    };
    itemArray.push(newItem);
    return res.status(201).json(newItem);
});


itemRouter.put("/:id", async (req:Request, res:Response) : Promise<Response> => {
    let itemFound = itemArray.find((x) => x.id === Number(req.params.id));
    if(itemFound !== undefined){
        itemFound.price = Number(req.body.price);
        itemFound.product = String(req.body.product);
        itemFound.quantity = Number(req.body.quantity);
        return res.status(200).json(itemFound)
    }
    else{
        return res.status(404).send("I can't find that item");
    }    
});

itemRouter.delete("/items/:id", async (req:Request, res:Response) : Promise<Response> => {
   let itemFound = itemArray.find((x) => x.id !== Number(req.params.id));
   
   if(itemFound === undefined){
    return res.status(404).send("Who dat?")
   }
   else{
    itemArray = itemArray.filter((x) => x.id !== Number(req.params.id));
    return res.status(204).send("Deleted");
   }
})

function GetNextId(){
    return Math.max(...itemArray.map((x) => x.id)) + 1
    // The "..." is called a "spread operator"
};