import Pusher from "pusher";
import appConstants from "../../appConstants";

export class PusherService {
	private pusher?: Pusher;
	private static instance: PusherService;

	constructor() {
		const { KEY, SECRET, APP_ID, USE_TLS, CLUSTER } = appConstants.PUSHER;

		try {
			this.pusher = new Pusher({
				appId: APP_ID,
				key: KEY,
				secret: SECRET,
				useTLS: USE_TLS,
				cluster: CLUSTER
			});
		} catch (error) {
			console.log("Connection to pusher failed!!!");
		}

		if (this.pusher) {
			PusherService.instance = this;
			console.log("Pusher connected successfully");
		}
	}

	public static getInstance(): PusherService {
		if (!PusherService.instance) {
			PusherService.instance = new PusherService();
		}
		return PusherService.instance;
	}

	async trigger(
		channel:  string,
		event:  string,
		data: any
	): Promise<void> {
		try {
			await this.pusher?.trigger(channel, event, data);
			console.log(
				"[Pusher Triggered Successfully]: for Channel: ",
				channel,
				" and Event: ",
				event
			);
		} catch (err) {
			console.log(err);
		}
	}
}
