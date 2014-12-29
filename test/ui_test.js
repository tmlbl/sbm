var ui = require('../lib/ui');

describe('User interface', function () {

  it('Should have a pretty loading animation', function (next) {
    ui.loading();
    setTimeout(ui.doneLoading, 1000);
    setTimeout(next, 1010);
  });

});
