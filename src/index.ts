import {AppDataSource} from "./data-source"
import {TransactionDemoService} from "./transanction-demo-service";

AppDataSource.initialize().then(async () => {

    const demoService = new TransactionDemoService(AppDataSource);

    await demoService.clearData();
    // await demoService.createUser(true);
    // await demoService.demoWrongTransaction(true);

    console.log('########## start demoBasicTransaction ########## ');

    await demoService.demoBasicTransaction(true);

}).catch(error => console.log(error))
