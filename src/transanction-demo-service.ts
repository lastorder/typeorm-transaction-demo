import {DataSource} from "typeorm";
import {User} from "./entity/User";
import {Repository} from "typeorm";
import {GiftCode} from "./entity/GiftCode";

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class TransactionDemoService {
    dataSource: DataSource;
    userRepository: Repository<User>;
    giftCodeRepository: Repository<GiftCode>;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
        this.userRepository = this.dataSource.getRepository(User);
        this.giftCodeRepository = this.dataSource.getRepository(GiftCode);
    }

    async initData() {
        await this.userRepository.clear();
        await this.giftCodeRepository.clear();
        const code = new GiftCode();
        code.code = '123456';
        code.status = 'active';
        await this.giftCodeRepository.save(code);
    }

    async demoNoTransaction(throwError: boolean = false) {
        const user = new User();
        user.firstName = 'yu';
        user.lastName = 'dong';
        user.age = 37;
        await this.userRepository.save(user);

        if (throwError) {
            throw new Error('Error occurred');
        }

        const user2 = new User();
        user2.firstName = 'yu';
        user2.lastName = 'dong';
        user2.age = 37;
        await this.userRepository.save(user);
    }

    async demoWrongTransaction(throwError: boolean = false) {

        this.dataSource.createEntityManager().transaction(async entityManager => {
            const user = new User();
            user.firstName = 'yu';
            user.lastName = 'dong';
            user.age = 37;
            await this.userRepository.save(user);

            if (throwError) {
                throw new Error('Error occurred');
            }

            const user2 = new User();
            user2.firstName = 'yu';
            user2.lastName = 'dong';
            user2.age = 37;
            await this.userRepository.save(user);
        });
    }

    async demoBasicTransaction(throwError: boolean = false) {

        this.dataSource.createEntityManager().transaction(async entityManager => {
            const user = new User();
            user.firstName = 'yu';
            user.lastName = 'dong';
            user.age = 37;

            await entityManager.withRepository(this.userRepository).save(user);
            // await this.userRepository.save(user);

            if (throwError) {
                throw new Error('Error occurred');
            }

            const user2 = new User();
            user2.firstName = 'yu';
            user2.lastName = 'dong';
            user2.age = 37;
            await entityManager.withRepository(this.userRepository).save(user);
            // await this.userRepository.save(user);
        });
    }

    private async redeemGiftCode(code: string) {
        await this.dataSource.createEntityManager().transaction(async entityManager => {
            const repo = entityManager.withRepository(this.giftCodeRepository);
            const giftCode = await repo.findOne({
                where: {code: code, status: 'active'},
            });

            if (giftCode) {
                console.log('--------------> Start redeeming gift code');
                await sleep(5); // simulate some redeem process
                console.log('--------------> Process redeeming gift code');
                giftCode.status = 'redeemed';
                await repo.save(giftCode);
                console.log('--------------> Finish redeeming gift code');
            } else {
                console.log('--------------> Gift code not found');
            }
        });
    }

    async demoConcurrentTransaction() {

        const tasks = [
            this.redeemGiftCode('123456'),
            this.redeemGiftCode('123456'),
            this.redeemGiftCode('123456'),
            this.redeemGiftCode('123456'),
            this.redeemGiftCode('123456'),
        ];
        await Promise.all(tasks);

        console.log('--------------> Checkout how many successful redeeming, and try to solve the issue');  //   "REPEATABLE READ",
    }
}