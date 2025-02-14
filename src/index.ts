import {AppDataSource} from "./data-source"
import {TransactionDemoService} from "./transanction-demo-service";

AppDataSource.initialize().then(async () => {

    const demoService = new TransactionDemoService(AppDataSource);

    await demoService.initData();

    await demoService.demoNoTransaction(true);
    // await demoService.demoBasicTransaction(true);
    // await demoService.demoConcurrentTransaction();
    // await demoService.demoPhantomReadTransaction();

}).catch(error => console.log(error))
