
import { NextFunction, Request, Response, Router } from "express";

const router = Router();

// logs path + IP address for every request
router.use((req: Request, res: Response, next: NextFunction) => {
    console.log("got a request for/from the following:");
    console.log(req.url);
    console.log(req.ip);
    next();
});

router.get("/", (req: Request, res: Response) => {
    res.render("home");
});

// handle 5XXs
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("error!", err.stack);
    res.status(500).send("Sorry, something went wrong!");
});

// handle 404s - must be last!
router.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("Sorry, we can't find that! Double check your URL");
});

export default router;
