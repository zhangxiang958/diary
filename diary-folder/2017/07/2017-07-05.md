# about Javascript && Submit

## var variable and the property of global object
the property of global object is equal to var variable, but var variable cannot be delete by delete command

## how to prevent the ajax submit frequently
the function of ajax's submit is common in front development, but in the old time, I often use a variable to set a flag(true or false) or set the button to disabled status to prevent the submit frequently.
but i think it's not safe to prevent. because, in MVVM framework like vue to set disabled status will be delay
in the next DOM update, so if user submit twice in very short time, it maybe send two time request to server side. If we use flag(true or false) to prevent the submit, the code of set flag will mix in code which is about bussiness.
so, i think it must have other better way to complete this job

active query the state of submit:
### alone submit 
```
module.submit = function(){
    if(this.promise.state() === 'pending') {
        return;
    }
    return this.promise = $.post('/api/save');
}
```
only when the first submit complete, then we can fire second time submit.

### greedy submit
```
module.submit = function(){
    if(this.promise.state() === 'pending') {
        this.promise.abort();
    }

    this.promise = $.post('/api/save');
}
```
no matter how many time to submit, only the final submit can run successfully. other submit will be abort.
this way can be use in like/not like button, we can set the state of DOM


use the util function to settle down the time of submit.
### use throttle or debounce


link:
[blog](https://my.oschina.net/u/2003657/blog/711866)
[zhihu](https://www.zhihu.com/question/19805411)