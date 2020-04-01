# `cyberball`

This project is bootstrapped by [aurelia-cli](https://github.com/aurelia/cli).

For more information, go to https://aurelia.io/docs/cli/cli-bundler

## Run dev app

Run `au run`, then open `http://localhost:9000`

To open browser automatically, do `au run --open`.

To change dev server port, do `au run --port 8888`.

## Usage in Qualtrics

HTML View:

```
var throwLog = [];

Qualtrics.SurveyEngine.addOnload(function()
{
	/*Place your JavaScript here to run when the page loads*/
	this.disableNextButton();
});

Qualtrics.SurveyEngine.addOnReady(function()
{
	/*Place your JavaScript here to run when the page is fully displayed*/
	var survey = this;

	window.addEventListener('message', function(e) {
		switch(e.data.type) {
			case 'throw':
				throwLog.push(e.data);
				break;
			case 'game-end':
				survey.enableNextButton();
				break;
			default:
		}
	});
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
	Qualtrics.SurveyEngine.setEmbeddedData('GameLog', JSON.stringify(throwLog));
});
```

JavaScript:

```
var throwLog = [];

Qualtrics.SurveyEngine.addOnload(function()
{
	/*Place your JavaScript here to run when the page loads*/
	this.disableNextButton();
});

Qualtrics.SurveyEngine.addOnReady(function()
{
	/*Place your JavaScript here to run when the page is fully displayed*/
	var survey = this;

	window.addEventListener('message', function(e) {
		switch(e.data.type) {
			case 'throw':
				throwLog.push(e.data);
				break;
			case 'game-end':
				survey.enableNextButton();
				break;
			default:
		}
	});
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
	Qualtrics.SurveyEngine.setEmbeddedData('GameLog', JSON.stringify(throwLog));
});
```
