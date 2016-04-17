import app from './plumbing/app';

app.listen(app.get('port'), () => {
    console.log('\n✔ Express server listening on port %d in %s mode',
        app.get('port'), app.get('env'));
});
