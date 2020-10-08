public class Node {
    var value: String
    var next: Node?
    weak var prev: Node?

    init(value: String) {
        self.value = value
    }
}

public class LinkedList {
    fileprivate var head: Node?
    private var tail: Node?

    public var isEmpty: Bool {
        return head == nil
    }

    public var first: Node? {
        return head
    }

    public var last: Node? {
        return tail
    }

    public func append(value: String) {
        // 1
        let newNode = Node(value: value)
        // 2
        if let tailNode = tail {
            newNode.prev = tailNode
            tailNode.next = newNode
        }
        // 3
        else {
            head = newNode
        }
        // 4
        tail = newNode
    }

}

// 1
extension LinkedList: CustomStringConvertible {
  // 2
  public var description: String {
    // 3
    var text = "["
    var node = head
    // 4
    while node != nil {
      text += "\(node!.value)"
      node = node!.next
      if node != nil { text += ", " }
    }
    // 5
    return text + "]"
  }
}

let dogBreeds = LinkedList()
dogBreeds.append(value: "Labrador")
dogBreeds.append(value: "Bulldog")
dogBreeds.append(value: "Beagle")
dogBreeds.append(value: "Husky")

print(dogBreeds)