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
<iframe id="cyberball" width="100%" height="580" src="https://cuddlebunny.github.io/osu-cyberball/#game"></iframe>
```

JavaScript:

```
var throwLog = [];
var leaveButtonText = 'Leave Game';

Qualtrics.SurveyEngine.addOnload(function()
{
	/*Place your JavaScript here to run when the page loads*/
	this.hideNextButton();
});

Qualtrics.SurveyEngine.addOnReady(function()
{
	/*Place your JavaScript here to run when the page is fully displayed*/
	var survey = this;

	window.addEventListener('message', function(e) {
		switch(e.data.type) {
			case 'throw':
			case 'leave':
				throwLog.push(e.data);
				break;
			case 'player-may-leave':
				throwLog.push(e.data);

				jQuery('#NextButton').clone()
					.attr('disabled', false)
					.attr('title', leaveButtonText)
					.attr('value', leaveButtonText)
					.attr('aria-label', leaveButtonText)
					.attr('style', 'margin-right: 10px')
					.prependTo('#Buttons')
					.one('click', function() {
						throwLog.push({
							type: 'player-left'
						});

						Qualtrics.SurveyEngine.setEmbeddedData('GameLog', JSON.stringify(throwLog));

						survey.clickNextButton();
					});

				break;
			case 'game-end':
				Qualtrics.SurveyEngine.setEmbeddedData('GameLog', JSON.stringify(throwLog));

				survey.showNextButton();

				// Auto-advance?
				//survey.clickNextButton();
				break;
			default:
		}
	});
});

Qualtrics.SurveyEngine.addOnUnload(function()
{

});
```
