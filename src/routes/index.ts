import { Router } from "express";
import { readdirSync } from "fs";

const router = Router();
const apiRouter = Router();
const PATH_ROUTER = `${__dirname}`;

const cleanFileName = (fileName: string) => {
    const file = fileName.split(".").shift();
    return file;
};

readdirSync(PATH_ROUTER).filter((fileName) => {
    const cleanName = cleanFileName(fileName);
    if (cleanName !== "index") {
        import(`./${cleanName}`).then((moduleRouter) => {
            router.use(`/${cleanName}`, moduleRouter.router);
        });
    }
});

apiRouter.use("/api", router);

export { apiRouter as router };