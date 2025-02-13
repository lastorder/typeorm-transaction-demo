import {AppDataSource} from "./data-source"
import {TransactionDemoService} from "./transanction-demo-service";

AppDataSource.initialize().then(async () => {

    const demoService = new TransactionDemoService(AppDataSource);

    await demoService.initData();
    // await demoService.createUser(true);
    // await demoService.demoWrongTransaction(true);

    console.log('\n\n\n\n --------------> start demoBasicTransaction \n');

    // await demoService.demoBasicTransaction(true);

    await demoService.demoConcurrentTransaction();

}).catch(error => console.log(error))
