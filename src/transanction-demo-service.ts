import {DataSource} from "typeorm";
import {User} from "./entity/User";
import {Repository} from "typeorm";
import {GiftCode} from "./entity/GiftCode";
import {GiftRedeem} from "./entity/GiftRedeem";

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class TransactionDemoService {
    dataSource: DataSource;
    userRepository: Repository<User>;
    giftCodeRepository: Repository<GiftCode>;
    giftRedeemRepository: Repository<GiftRedeem>;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
        this.userRepository = this.dataSource.getRepository(User);
        this.giftCodeRepository = this.dataSource.getRepository(GiftCode);
        this.giftRedeemRepository = this.dataSource.getRepository(GiftRedeem);

    }

    async initData() {
        await this.userRepository.clear();
        await this.giftCodeRepository.clear();
        await this.giftRedeemRepository.clear();

        const code = new GiftCode();
        code.code = '123456';
        code.status = 'active';
        await this.giftCodeRepository.save(code);


        console.log('\n\n\n\n --------------> start demoBasicTransaction \n');
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


    async demoBasicTransaction(throwError: boolean = false) {

        this.dataSource.createEntityManager().transaction(async entityManager => {
            const user = new User();
            user.firstName = 'yu1';
            user.lastName = 'dong1';
            user.age = 37;

            // await entityManager.withRepository(this.userRepository).save(user);
            await this.userRepository.save(user);

            if (throwError) {
                throw new Error('Error occurred');
            }

            const user2 = new User();
            user2.firstName = 'yu2';
            user2.lastName = 'dong2';
            user2.age = 37;
            // await entityManager.withRepository(this.userRepository).save(user);
            await this.userRepository.save(user);
        });

        console.log('--------------> Checkout if user1 been inserted, and try to solve the issue');
    }

    private async redeemGiftCode(code: string, user_id: number, comments?: string) {
        await this.dataSource.createEntityManager().transaction(async entityManager => {
            const repo = entityManager.withRepository(this.giftCodeRepository);
            const giftCode = await repo.findOne({
                where: {code: code, status: 'active'},
            });

            if (giftCode) {
                console.log('--------------> Start redeeming gift code for user: ' + user_id);

                // await sleep(5); // simulate some redeem process
                console.log('--------------> Process redeeming gift code for user: ' + user_id);

                const redeem = new GiftRedeem();
                redeem.gift_code_id = giftCode.id;
                redeem.user_id = user_id;
                redeem.comments = comments;
                await this.giftRedeemRepository.save(redeem);

                giftCode.status = 'redeemed';
                await repo.save(giftCode);
                console.log('--------------> Finish redeeming gift code for user: ' + user_id);
            } else {
                console.log('--------------> Gift code not found');
            }
        });
    }

    async demoConcurrentTransaction() {

        const tasks = [
            this.redeemGiftCode('123456', 1, 'first'),
            this.redeemGiftCode('123456', 2, 'second'),
            this.redeemGiftCode('123456', 3, 'third'),
            this.redeemGiftCode('123456', 4, 'fourth'),
            this.redeemGiftCode('123456', 5, 'fifth'),
        ];
        await Promise.all(tasks);

        console.log('--------------> Checkout how many successful redeeming, and try to solve the issue');
    }


    // one promotion code can be redeemed only twice
    private async multipleRedeemGiftCode(code: string, user_id: number, comments?: string) {
        await this.dataSource.createEntityManager().transaction("REPEATABLE READ", async entityManager => {
            const giftCodeRepo = entityManager.withRepository(this.giftCodeRepository);
            const giftRedeemRepo = entityManager.withRepository(this.giftRedeemRepository);

            const giftCode = await giftCodeRepo.findOne({
                where: {code: code, status: 'active'},
            });

            if (giftCode) {
                console.log('--------------> Start redeeming gift code for user: ' + user_id);
                const alreadyRedeemCount = await giftRedeemRepo.count({where: {gift_code_id: giftCode.id}})

                if (alreadyRedeemCount < 2) {
                    console.log('--------------> Process redeeming gift code for user: ' + user_id);
                    const redeem = new GiftRedeem();
                    redeem.gift_code_id = giftCode.id;
                    redeem.user_id = user_id;
                    redeem.comments = comments;
                    await giftRedeemRepo.save(redeem);

                    console.log('--------------> Finish redeeming gift code for user: ' + user_id);
                } else {
                    console.log('--------------> Gift code has been redeemed twice');
                }

            } else {
                console.log('--------------> Gift code not found');
            }
        });
    }

    async demoPhantomReadTransaction() {

        const tasks = [
            this.multipleRedeemGiftCode('123456', 1, 'first'),
            this.multipleRedeemGiftCode('123456', 2, 'second'),
            this.multipleRedeemGiftCode('123456', 3, 'third'),
            this.multipleRedeemGiftCode('123456', 4, 'fourth'),
            this.multipleRedeemGiftCode('123456', 5, 'fifth'),
        ];
        await Promise.all(tasks);

        console.log('--------------> Checkout how many successful redeeming, and try to solve the issue');  //   "REPEATABLE READ",
    }
}