import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = 3001;

app.use(express.json());

const prisma = new PrismaClient();

app.get('/', async (req: Request, res: Response) => {
	const users = await prisma.user.findMany({
		include: { cars: true },
	});
	res.json(users);
});

app.get('/:id', async (req: Request, res: Response) => {
	const id = req.params.id;
	const user = await prisma.user.findUnique({
		where: {
			id: Number(id),
		},
	});
	res.json(user);
});

app.post('/', async (req: Request, res: Response) => {
	const { username, password } = req.body;
	const user = await prisma.user.create({
		data: {
			username: username,
			password: password,
		},
	});

	res.json(user);
});

app.post('/createManyUsers', async (req: Request, res: Response) => {
	const { userList } = req.body;
	const users = await prisma.user.createMany({
		data: userList,
	});

	res.json(users);
});

app.post('/createManyCars', async (req: Request, res: Response) => {
	const { carList } = req.body;
	const cars = await prisma.car.createMany({
		data: carList,
	});

	res.json(cars);
});

app.put('/', async (req: Request, res: Response) => {
	const { id, username } = req.body;
	const updatedUser = await prisma.user.update({
		where: { id: Number(id) },
		data: { username: username },
	});

	res.json(updatedUser);
});

app.delete('/:id', async (req: Request, res: Response) => {
	const id = req.params.id;
	const deletedUser = await prisma.user.delete({
		where: { id: Number(id) },
	});

	res.json(deletedUser);
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
