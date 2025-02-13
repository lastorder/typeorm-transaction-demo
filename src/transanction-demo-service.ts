import {DataSource} from "typeorm";
import {User} from "./entity/User";
import {Repository} from "typeorm";

export class TransactionDemoService {
    dataSource: DataSource;
    userRepository: Repository<User>;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
        this.userRepository = this.dataSource.getRepository(User);
    }

    async clearData() {
        await this.userRepository.clear();
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
}