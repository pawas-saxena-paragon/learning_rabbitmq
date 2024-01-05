### instructions

- run `docker-compose up`
- for management console open #[link](http://localhost:5672) use usermame `guest` password `guest`
- commands
  | command | action |
  | --- | --- |
  | basic:consume | creates a basic consumer|
  | basic:produce | send a message on producer|  
  | broadcast:consumer | creates a brodcast consumer|
  | broadcast:produce | sends a message on a broadcast producers |\
  | directroute:consume <routing_key> | creates a consumer that listens on the specified <routing_key> along with an additional key `both`|
  | directroute:produce <routing_key> | sends message on the specified <routing_key> |