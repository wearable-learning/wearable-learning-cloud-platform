package wlcp.shared.message;

public class DisconnectResponseMessage implements IMessage {
	public enum Code { SUCCESS, FAIL}
	public Code code;
}
